import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Camera, Calendar, LoaderCircle } from 'lucide-react';
import { styles } from './EdicionModal.styles';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useWindowSize } from '../../hooks/useWindowSize';
import CityManager from '../Shared/CityManager';
import { compressImage } from '../../utils/imageUtils';
import { generarTituloInteligente } from '../../utils/viajeUtils';

const EdicionModal = ({ viaje, onClose, onSave, esBorrador, ciudadInicial, isSaving = false }) => {
  const { usuario } = useAuth();
  const { pushToast } = useToast();
  const { isMobile } = useWindowSize(768);
  const [formData, setFormData] = useState({});
  const [paradas, setParadas] = useState([]);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [isTituloAuto, setIsTituloAuto] = useState(true);
  const [titlePulse, setTitlePulse] = useState(false);
  const titlePulseRef = useRef(null);

  useEffect(() => {
    if (viaje) {
      setFormData({
        ...viaje,
        titulo: esBorrador ? (viaje.titulo || '') : (viaje.titulo || `Viaje a ${viaje.nombreEspanol}`),
        fechaInicio: viaje.fechaInicio || new Date().toISOString().split('T')[0],
        fechaFin: viaje.fechaFin || new Date().toISOString().split('T')[0],
        foto: viaje.foto,
        texto: viaje.texto || "",
        flag: viaje.flag,
        code: viaje.code,
        nombreEspanol: viaje.nombreEspanol
      });
      
      if (esBorrador && ciudadInicial) {
        // Nuevo viaje: agregar ciudad inicial
        setParadas([{ 
            id: 'init', 
            nombre: ciudadInicial.nombre, 
            coordenadas: ciudadInicial.coordenadas,
            fecha: viaje.fechaInicio || new Date().toISOString().split('T')[0],
            paisCodigo: ciudadInicial.paisCodigo,
            flag: viaje.flag 
        }]);
      } else if (!esBorrador && usuario && viaje.id) {
        // Viaje existente: cargar paradas desde Firestore
        const cargarParadas = async () => {
          try {
            const paradasRef = collection(db, `usuarios/${usuario.uid}/viajes/${viaje.id}/paradas`);
            const snap = await getDocs(paradasRef);
            const loaded = snap.docs.map(d => ({id: d.id, ...d.data()}));
            setParadas(loaded.sort((a,b) => new Date(a.fecha) - new Date(b.fecha)));
          } catch (e) {
            console.error("Error cargando paradas:", e);
            setParadas([]);
          }
        };
        cargarParadas();
      } else {
        setParadas([]); 
      }
      setIsTituloAuto(esBorrador);
    }
  }, [viaje, esBorrador, ciudadInicial, usuario]);

  useEffect(() => {
    if (!esBorrador || !isTituloAuto) return;
    const tituloAuto = generarTituloInteligente(formData.nombreEspanol, paradas);
    if (tituloAuto && tituloAuto !== formData.titulo) {
      setFormData((prev) => ({ ...prev, titulo: tituloAuto }));
      setTitlePulse(true);
      if (titlePulseRef.current) clearTimeout(titlePulseRef.current);
      titlePulseRef.current = setTimeout(() => setTitlePulse(false), 900);
    }
  }, [esBorrador, isTituloAuto, paradas, formData.nombreEspanol, formData.titulo]);

  useEffect(() => () => {
    if (titlePulseRef.current) clearTimeout(titlePulseRef.current);
  }, []);

  const handleSave = async () => {
    if (!formData.nombreEspanol || isProcessingImage || isSaving) return;
    const ok = await onSave(viaje.id, { ...formData, paradasNuevas: paradas });
    if (ok) onClose();
  };

  const handleFileChange = async (e) => {
    setIsProcessingImage(true);
    const file = e.target.files?.[0];
    if (!file) {
      setIsProcessingImage(false);
      return;
    }

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      pushToast('Formato no soportado. Usa JPG o PNG.', 'error');
      e.target.value = '';
      setIsProcessingImage(false);
      return;
    }

    try {
      const { blob, dataUrl } = await compressImage(file, 1920, 0.8);
      const optimizedFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.jpg'), {
        type: 'image/jpeg',
        lastModified: Date.now()
      });

      setFormData((prev) => ({ ...prev, foto: dataUrl, fotoFile: optimizedFile }));
    } catch (error) {
      console.error('Error optimizando imagen:', error);
      pushToast('No se pudo optimizar la imagen seleccionada.', 'error');
    } finally {
      setIsProcessingImage(false);
      e.target.value = '';
    }
  };

  if (!viaje) return null;

  const isBusy = isSaving || isProcessingImage;
  const fechasInvalidas =
    formData.fechaInicio &&
    formData.fechaFin &&
    new Date(formData.fechaInicio) > new Date(formData.fechaFin);
  const sinParadas = paradas.length === 0;

  return (
    <AnimatePresence>
      <motion.div style={styles.overlay(isMobile)} onClick={onClose} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
        <motion.div style={styles.modal(isMobile)} onClick={e => e.stopPropagation()} initial={{y:50}} animate={{y:0}} exit={{y:50}}>
          <div style={styles.header(formData.foto, isMobile)}>
            <div style={styles.headerOverlay} />
            <div style={styles.headerContent}>
                {formData.flag ? (
                    <img src={formData.flag} alt="Bandera" style={styles.flagImg} onError={(e) => e.target.style.display = 'none'}/>
                ) : <span style={{fontSize:'3rem'}}>🌍</span>}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      name="titulo"
                      value={formData.titulo || ''}
                      onChange={e => {
                        setFormData({...formData, titulo: e.target.value});
                        if (esBorrador && isTituloAuto) setIsTituloAuto(false);
                      }}
                      style={titlePulse ? styles.titleInputAutoPulse : styles.titleInput}
                      placeholder="Título del viaje"
                      disabled={isBusy}
                    />
                    {esBorrador && (
                      <button
                        type="button"
                        style={styles.autoBadge(isTituloAuto)}
                        title={isTituloAuto
                          ? 'Se actualiza al agregar o quitar ciudades'
                          : 'Usando titulo manual. Click para volver a auto.'}
                        onClick={() => setIsTituloAuto((prev) => !prev)}
                        disabled={isBusy}
                      >
                        {isTituloAuto ? 'Auto' : 'Manual'}
                      </button>
                    )}
                  </div>
                </div>
            </div>
            {isProcessingImage && (
              <div style={styles.processingBadge}>
                <LoaderCircle size={14} className="spin" />
                Optimizando...
              </div>
            )}
            <label style={styles.cameraBtn(isBusy)}>
              <Camera size={18} />
              <input type="file" hidden onChange={handleFileChange} accept="image/jpeg,image/png" disabled={isBusy} />
            </label>
          </div>

          <div style={styles.body} className="custom-scroll">
            <div style={styles.section}>
                <label style={styles.label}><Calendar size={14}/> Fechas</label>
                <div style={styles.row}>
                <input type="date" value={formData.fechaInicio || ''} onChange={e => setFormData({...formData, fechaInicio: e.target.value})} style={styles.dateInput} disabled={isBusy} />
                    <span style={{color:'#94a3b8'}}>hasta</span>
                <input type="date" value={formData.fechaFin || ''} onChange={e => setFormData({...formData, fechaFin: e.target.value})} style={styles.dateInput} disabled={isBusy} />
                </div>
              {fechasInvalidas && (
                <span style={styles.inlineError}>La fecha de fin no puede ser anterior al inicio.</span>
              )}
            </div>
            <div style={styles.section}>
                <label style={styles.label}>Ciudades y Paradas</label>
                <CityManager paradas={paradas} setParadas={setParadas} />
              {sinParadas && (
                <span style={styles.inlineError}>Agrega al menos una ciudad para continuar.</span>
              )}
            </div>
            <div style={styles.section}>
                <label style={styles.label}>Notas</label>
              <textarea value={formData.texto || ''} onChange={e => setFormData({...formData, texto: e.target.value})} style={styles.textarea} placeholder="Escribe tus recuerdos aquí..." disabled={isBusy} />
            </div>
            <div style={styles.footer}>
                <button onClick={onClose} style={styles.cancelBtn(isBusy)} disabled={isBusy}>Cancelar</button>
                <button onClick={handleSave} style={styles.saveBtn(isBusy)} disabled={isBusy}>
                  {isBusy ? <LoaderCircle size={18} className="spin" /> : <Save size={18} />}
                  {isProcessingImage ? 'Procesando...' : (isSaving ? 'Guardando...' : (esBorrador ? 'Crear Viaje' : 'Guardar'))}
                </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EdicionModal;

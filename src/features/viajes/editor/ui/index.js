// EdicionModal se importa vía lazy() desde AppModalsManager y dentro de
// VisorViaje para evitar que el editor pesado entre en el bundle inicial.
// Ver: src/app/layout/AppModalsManager.jsx
export { styles as edicionModalStyles } from './EdicionModal.styles';
export * from './components';

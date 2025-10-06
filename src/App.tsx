import styles from './App.module.scss'
import Controls from './components/Controls/Controls'


function App() {
  return (
    <div className={styles.app}>
      <main className={styles.container}>
        <div className={styles.platePreview}>
          Plate Preview Area
        </div>
        <Controls />
        
      </main>
    </div>
  )
}

export default App

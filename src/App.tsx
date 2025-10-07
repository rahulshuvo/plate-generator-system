import styles from './App.module.scss'
import PreviewCard from './components/Canvas/PreviewCard'
import Controls from './components/Controls/Controls'
import { usePlates } from '@/hooks/use-plates'


function App() {
  const { plates, addPlate, removePlate, updatePlate } = usePlates()
  return (
    <div className={styles.app}>
      <main className={styles.container}>
        <PreviewCard
          plates={plates}
        />
        <Controls
          plates={plates}
          addPlate={addPlate}
          removePlate={removePlate}
          updatePlate={updatePlate}
        />
        
      </main>
    </div>
  )
}

export default App

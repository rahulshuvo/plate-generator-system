import { Button } from 'antd'
import styles from './Controls.module.scss'
import PlateInputForm from './PlateInputForm'
import { usePlates } from '@/hooks/use-plates'
import { Plus } from 'lucide-react'

interface ControlsProps {
  plates: ReturnType<typeof usePlates>['plates']
  addPlate: ReturnType<typeof usePlates>['addPlate']
  removePlate: ReturnType<typeof usePlates>['removePlate']
  updatePlate: ReturnType<typeof usePlates>['updatePlate']
}

function Controls({
  plates,
  addPlate,
  removePlate,
  updatePlate,
}: ControlsProps) {

  return (
    <div className={styles.controls}>
      Controls Area
      {plates.map((plate) => (
        <PlateInputForm
          key={plate.id}
          index={plates.indexOf(plate)}
          plate={plate}
          removePlate={removePlate}
          updatePlate={updatePlate}
          numberOfPlates={plates.length}
        />
      ))}
      <Button
        onClick={addPlate}
        icon={<Plus size={16} />}
        iconPosition="end"
        variant="outlined"
        className={styles.addButton}
        disabled={plates.length >= 10}
        style={{
          borderColor: '#21c35d',
          color: '#21c35d',
        }}
      >
        Add Back Panel
      </Button>
    </div>
  )
}

export default Controls

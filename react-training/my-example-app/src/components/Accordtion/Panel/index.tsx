type PanelProps = {
  title: string
  description: string
  isActive: boolean
  onChange: () => void
}

export default function Panel({ title, description, isActive, onChange }: PanelProps) {
  return (
    <>
      <h2>{title}</h2>
      {isActive && <p>{description}</p>}
      <button onClick={onChange}>{isActive ? 'Hide' : 'Show'}</button>
    </>
  )
}

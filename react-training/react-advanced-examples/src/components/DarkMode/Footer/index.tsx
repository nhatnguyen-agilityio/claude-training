import { useContext } from "react"
import { ThemeContext } from ".."

const Footer = () => {
  const theme = useContext(ThemeContext)
  const className = `bg-${theme?.screenTheme}`

  return (
    <div className={className}>
      <p>Footer</p>
      <label>
        <input type="checkbox" value={theme?.screenTheme} onChange={() => theme?.setScreenTheme(theme?.screenTheme === "light" ? "light" : "dark")} />
        <span>Dark Mode</span>
      </label>
    </div>
  )
}

export default Footer

import { useContext } from "react"
import { ThemeContext } from ".."
import Footer from "../Footer"

const Main = () => {
  const theme = useContext(ThemeContext)
  const className = `bg-${theme?.screenTheme}`
  const footerTheme = theme?.screenTheme === "light" ? "dark" : "light"

  return (
    <div className={className}>
      <h1>Dark Mode</h1>
      <button>Sign Up</button>
      <button>Sign In</button>
      <ThemeContext.Provider value={{ screenTheme: footerTheme, setScreenTheme: theme?.setScreenTheme || (() => {}) }}>
        <Footer />
      </ThemeContext.Provider>
    </div>
  )
}

export default Main

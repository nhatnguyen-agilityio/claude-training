import { Button } from "@/components/ui/button"
import { useAuth } from "@/Hooks/Auth"

const Home = () => {
  const auth = useAuth();

  return (
    <>
      <div className="">
        <Button onClick={auth.logout}>Logout</Button>
      </div>
    </>
  )
}

export default Home

import { memo } from "react"

const Account = ({ email, password }: {email: string, password: string}) => {
  console.log("🚀 ~ Account ~ email:", email)
  console.log("🚀 ~ Account ~ password:", password)

  return (
    <>
      <p>
        Email: {email}
      </p>
      <p>
        Password: {password}
      </p>
    </>
  )
}

export default memo(Account)

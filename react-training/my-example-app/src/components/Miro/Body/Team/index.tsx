import Button from "../../Common/button"
import Title from "../../Common/title"
import TeamMember from "./TeamMember"

const Team = () => {
  return (
    <div className="mt-15">
      <div className="container text-center">
        <Title title={"Loved by the world's best teams"} />
        <Button
          text={"See all customer stories →"}
          className={"bg-white text-[#4262FF] border rounded-3xl border-[#4262FF] py-2 px-4 text-lg mt-6 hover:bg-blue-50 active:bg-blue-200"}
          onClick={() => alert("This feature will be available soon!")}
        />
        <TeamMember />
      </div>
    </div>
  )
}

export default Team

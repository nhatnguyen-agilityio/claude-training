import NavBarItem from "./NavBarItem";

const Navbar = () => {
  const navBarItems = [
    {id: 1, name: "Product", hasArrow: true},
    {id: 2, name: "Solutions", hasArrow: true},
    {id: 3, name: "Resources", hasArrow: true},
    {id: 4, name: "Enterprise", hasArrow: false},
    {id: 5, name: "Pricing", hasArrow: false},
  ];

  return (
    <div className="h-full flex items-center mr-auto">
      <ul className="flex h-full justify-center">
        {navBarItems.map((item) => (
          <NavBarItem key={item.id} item={item} />
        ))}
      </ul>
    </div>
  );
}

export default Navbar;

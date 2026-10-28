interface HelloProps {
  name?: string;
}

const Hello = ({ props = {} }: { props?: HelloProps }) => {
  if (props.name) {
    return <div>Hello {props.name}</div>;
  }
  else {
    return <div>Hello World</div>;
  }
}

export default Hello;

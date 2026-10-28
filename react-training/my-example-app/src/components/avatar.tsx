type avatarProps = {
  name: string;
  imageSize?: number;
  imageUrl: string;
};

export default function Avatar({ name, imageSize = 90, imageUrl }: avatarProps) {
    return (
        <div className="avatar">
            <img src={imageUrl} alt="Avatar" style={{ width: imageSize, height: imageSize }} />
            <h2>{name}</h2>
            <p>Web Developer</p>
        </div>
    );
}

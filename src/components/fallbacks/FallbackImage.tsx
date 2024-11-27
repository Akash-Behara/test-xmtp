
interface FallbackImageProps {
    name: string | undefined;
}

const FallbackImage = ({name}: FallbackImageProps) => {

    const firstName = name?.split(' ')[0]?.charAt(0);
    const lastName = name?.split(' ')[1]?.charAt(0);

  return (
    <div className="capitalize">
        {firstName}
        {lastName}
    </div>
  )
}

export default FallbackImage
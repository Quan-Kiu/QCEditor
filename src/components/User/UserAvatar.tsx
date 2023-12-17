import { settings } from "@/settings";
import Image, { ImageProps } from "next/image";

type Props = Partial<ImageProps>;

const UserAvatar = ({ src, ...props }: Props) => {
  return (
    <Image
      width={60}
      height={60}
      className="rounded-full"
      alt={(src as string) || settings.avatarSrc}
      src={src || settings.avatarSrc}
      {...props}
    />
  );
};

export default UserAvatar;

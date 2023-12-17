import { settings } from "@/settings";
import Image, { ImageProps } from "next/image";
import { useState } from "react";

type Props = Partial<ImageProps>;

const UserAvatar = ({ src, className, ...props }: Props) => {
  const [imgSrc, setImgSrc] = useState(src || settings.avatarSrc);
  return (
    <Image
      width={60}
      height={60}
      onError={(e) => {
        setImgSrc(settings.avatarSrc);
      }}
      alt={imgSrc as string}
      src={imgSrc as string}
      {...props}
      className={["rounded-full  object-fit", className].join(" ")}
    />
  );
};

export default UserAvatar;

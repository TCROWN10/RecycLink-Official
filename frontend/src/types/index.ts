import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
    size?: number;
};

export type T_User = {
    id: number;
    name: string;
    userAddr: string;
    xpoints: number;
    role: string;
    timeJoined: string;
}

import { BrandLogoStyled } from "./styled";

// The brand logo image, used in the public header, the admin rail and top bar,
// and the sign-in card. Width follows the image's aspect ratio; height is fixed
// by the caller so the mark sits consistently in each bar. The default logo has
// a black background, so it blends on the dark public header and reads as a logo
// chip on the light admin — see the "use as-is" branding decision.
export default function BrandLogo({ src, height = 30 }: { src: string; height?: number }) {
	return <BrandLogoStyled src={src} alt="Train With Awad" style={{ height }} />;
}

import { Header } from "@react-navigation/elements";
import sfiLogo from "../../../../assets/SFI-logo.png";

export default function BrandedHeader() {
  return (
    <Header>
      <Image source={sfiLogo} />
    </Header>
  );
}

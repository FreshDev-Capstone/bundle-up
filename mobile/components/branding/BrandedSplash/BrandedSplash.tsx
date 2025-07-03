import { BRANDS } from "../../../../shared/config/brands";

export default function BrandedSplash({ accountType, onComplete }) {
  const brand =
    accountType === "business" ? BRANDS.NATURAL_FOODS : BRANDS.SUNSHINE_FARM;

  return (
    <SplashContainer backgroundColor={brand.colors.background}>
      <Logo source={brand.logo} />
      <BrandName color={brand.colors.primary}>{brand.name}</BrandName>
    </SplashContainer>
  );
}

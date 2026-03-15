import BannerSlider from '../../../components/Home/BannerSlider';
import InfoSection from '../../../components/Home/InfoSection';
import ProductTabsSection from '../../../components/Home/ProductTabsSection';
import SaleOffSection from '../../../components/Home/SaleOffSection';
import BadmintonProductsSection from '../../../components/Home/BadmintonProductsSection';
import PickleballProductsSection from '../../../components/Home/PickleballProductsSection';
import TennisProductsSection from '../../../components/Home/TennisProductsSection';

const HomePage = () => {
    return (
        <div className="w-full !bg-white">
            <BannerSlider />
            <InfoSection />
            <ProductTabsSection />
            <SaleOffSection />
            <BadmintonProductsSection />
            <PickleballProductsSection />
            <TennisProductsSection />

        </div>
    );
};

export default HomePage; 
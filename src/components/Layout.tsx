import Footer from './Footer';
import Navbar from './Navbar';

interface Props {
  children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => (
  <>
    <Navbar />
    {children}
    <Footer />
  </>
);
export default Layout;

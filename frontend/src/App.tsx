import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useMotionValue } from 'framer-motion';
import { Leaf, Menu, X, ShoppingCart, CheckCircle, Heart, Star, Sprout, Maximize, Volume2, XCircle, Plus, Minus, Package, ArrowRight, Info } from 'lucide-react';

const products = [
  { id: 1, name: 'Premium Sona Masuri Rice', shortDesc: 'Sona Masuri, Basmati & more', desc: 'Aged for 12 months, unpolished and organically grown without pesticides. Perfect for daily meals and traditional Indian recipes. Contains high fiber and essential nutrients.', price: 180, unit: '/ kg', img: '/images/rice_img_1778906211414.png' },
  { id: 2, name: 'Cold Pressed Sesame Oil', shortDesc: 'Pure Sesame, Peanut & Coconut Oil', desc: 'Traditional wooden cold-pressed (Mara Chekku) sesame oil. Retains all natural nutrients, antioxidants, and original authentic aroma for healthy cooking.', price: 450, unit: '/ Litre', img: '/images/oil_img_1778906243116.png' },
  { id: 3, name: 'Organic Turmeric Powder', shortDesc: 'High curcumin, naturally grown', desc: 'High curcumin content Manjal Podi. Sun-dried and traditionally ground for maximum health benefits. Known for its anti-inflammatory properties.', price: 120, unit: '/ 250g', img: '/images/turmeric_img_1778906262796.png' },
  { id: 4, name: 'Stone Ground Chilli Powder', shortDesc: 'Sun-dried, traditional stone ground', desc: 'Authentic Guntur Milagai powder. Sun-dried and stone ground to preserve natural essential oils and traditional heat. No artificial colors added.', price: 160, unit: '/ 250g', img: '/images/chilli_img_1778906277998.png' },
  { id: 5, name: 'Whole Premium Cashews', shortDesc: 'Handpicked, whole cashew nuts', desc: 'W320 grade premium Kaju. Handpicked from traditional farms, completely natural without any chemical processing or artificial bleaching.', price: 350, unit: '/ 250g', img: '/images/rice_img_1778906211414.png' },
  { id: 6, name: 'Unpolished Toor Dal', shortDesc: 'Unpolished, rich in protein', desc: 'Rich in plant-based protein and natural dietary fiber. Sourced directly from our traditional farmers and left unpolished to retain maximum nutrition.', price: 190, unit: '/ kg', img: '/images/turmeric_img_1778906262796.png' }
];

const features = [
  { icon: <Leaf className="w-8 h-8 text-[#D8A031]" />, title: 'Farm Fresh', desc: 'Sourced directly from our own farms.' },
  { icon: <Sprout className="w-8 h-8 text-[#D8A031]" />, title: 'Naturally Grown', desc: 'No synthetic fertilizers or pesticides used.' },
  { icon: <CheckCircle className="w-8 h-8 text-[#D8A031]" />, title: 'Traditional Quality', desc: 'Processed using ancient Indian techniques.' },
  { icon: <Heart className="w-8 h-8 text-[#D8A031]" />, title: 'Healthy Lifestyle', desc: 'Promotes well-being and natural vitality.' }
];

const testimonials = [
  { name: 'Aarti Sharma', review: 'The cold pressed oil has brought back the authentic taste of my grandmother\'s cooking. Highly recommended!' },
  { name: 'Ramesh Iyer', review: 'Finally found pure, unpolished dal. You can immediately tell the difference in aroma and texture.' },
  { name: 'Priya Desai', review: 'Amruteswari Satvik Foods provides the best turmeric powder. Truly premium and completely natural.' }
];

// --- Custom Cursor Component ---
const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isTouch, setIsTouch] = useState(true);

  useEffect(() => {
    setIsTouch(window.matchMedia('(pointer: coarse)').matches);

    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      const target = e.target as HTMLElement;
      setIsHovering(!!target.closest('button, a, .cursor-pointer'));
    };

    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  if (isTouch) return null;

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-3 h-3 bg-[#D8A031] rounded-full pointer-events-none z-[9999] mix-blend-difference"
        animate={{ x: mousePosition.x - 6, y: mousePosition.y - 6, scale: isHovering ? 2.5 : 1 }}
        transition={{ type: "spring", stiffness: 600, damping: 30, mass: 0.5 }}
      />
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 border border-[#D8A031]/50 rounded-full pointer-events-none z-[9998]"
        animate={{ x: mousePosition.x - 20, y: mousePosition.y - 20, scale: isHovering ? 1.5 : 1 }}
        transition={{ type: "spring", stiffness: 250, damping: 20, mass: 0.8 }}
      />
    </>
  );
};

// --- Hover Card Component ---
const TiltCard = ({ children, onClick, className = "" }: { children: React.ReactNode, onClick?: () => void, className?: string }) => {
  return (
    <motion.div
      onClick={onClick}
      className={`cursor-pointer transition-shadow duration-300 ${className}`}
      whileHover={{ scale: 1.03, y: -5, zIndex: 10, boxShadow: "0 25px 50px -12px rgba(30, 58, 43, 0.25)" }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {children}
    </motion.div>
  );
};

// --- Main App ---
function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Modals & Prompts
  const [showWelcome, setShowWelcome] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  
  // Cart State
  const [cartItems, setCartItems] = useState<any[]>([]);

  // Video Ref
  const videoRef = useRef<HTMLVideoElement>(null);

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 1000], [0, 300]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle Fullscreen & Sound
  const handleExperience = async () => {
    setShowWelcome(false);
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
      if (videoRef.current) {
        videoRef.current.muted = false;
        videoRef.current.volume = 0.15; // Low volume so it doesn't disturb
        videoRef.current.play().catch(e => console.log("Video play error:", e));
      }
    } catch (err) {
      console.log("Fullscreen blocked by browser", err);
    }
  };

  const skipExperience = () => {
    setShowWelcome(false);
    if (videoRef.current) {
      videoRef.current.play().catch(e => console.log("Video play error:", e));
    }
  };

  const addToCart = (product: any) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQty = (id: number, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : item;
      }
      return item;
    }));
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);

  return (
    <div className="bg-[#FAF7F2] min-h-screen font-sans text-[#1E3A2B] overflow-x-hidden selection:bg-[#D8A031] selection:text-[#1E3A2B]">
      <CustomCursor />

      {/* Welcome / Fullscreen Prompt */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1E3A2B]/90 backdrop-blur-xl px-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
              className="bg-[#FAF7F2] p-8 md:p-12 rounded-3xl max-w-lg w-full text-center shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#D8A031] to-[#1E3A2B]"></div>
              <Leaf className="w-16 h-16 text-[#D8A031] mx-auto mb-6" />
              <h2 className="text-3xl font-serif text-[#1E3A2B] mb-4">Welcome to Amruteswari</h2>
              <p className="text-[#5A3E2B] mb-8 leading-relaxed">
                For the best cinematic and immersive experience, we recommend entering full-screen mode with sound enabled.
              </p>
              <div className="flex flex-col gap-4">
                <button 
                  onClick={handleExperience}
                  className="flex items-center justify-center gap-2 bg-[#1E3A2B] text-white py-4 px-6 rounded-full font-medium hover:bg-[#D8A031] hover:text-[#1E3A2B] transition-all group"
                >
                  <Maximize className="w-5 h-5 group-hover:scale-110 transition-transform" /> 
                  <Volume2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Enter Full Experience
                </button>
                <button 
                  onClick={skipExperience}
                  className="text-[#5A3E2B] font-medium hover:text-[#1E3A2B] transition-colors py-2"
                >
                  Continue standard view
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className={`fixed w-full z-40 transition-all duration-300 ${isScrolled ? 'py-2 md:py-3' : 'py-4 md:py-6'}`}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className={`flex items-center justify-between transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md border border-white/50 shadow-lg rounded-full px-4 md:px-6 py-2 md:py-3' : 'px-2'}`}>
            <div className="flex items-center gap-2 cursor-pointer">
              <Leaf className={`w-6 h-6 md:w-8 md:h-8 ${isScrolled ? 'text-[#1E3A2B]' : 'text-white'}`} />
              <span className={`text-xl md:text-2xl font-serif font-semibold tracking-wide ${isScrolled ? 'text-[#1E3A2B]' : 'text-white'}`}>
                Amruteswari
              </span>
            </div>

            {/* Desktop Nav */}
            <div className={`hidden md:flex items-center gap-8 font-medium ${isScrolled ? 'text-[#1E3A2B]/80' : 'text-white/90'}`}>
              <a href="#home" className={`hover:text-[#D8A031] transition-colors ${isScrolled ? 'text-[#1E3A2B] hover:text-[#D8A031]' : ''}`}>Home</a>
              <a href="#about" className={`hover:text-[#D8A031] transition-colors ${isScrolled ? 'text-[#1E3A2B] hover:text-[#D8A031]' : ''}`}>About</a>
              <a href="#products" className={`hover:text-[#D8A031] transition-colors ${isScrolled ? 'text-[#1E3A2B] hover:text-[#D8A031]' : ''}`}>Products</a>
              <button onClick={() => setIsOrdersOpen(true)} className={`hover:text-[#D8A031] transition-colors flex items-center gap-1 ${isScrolled ? 'text-[#1E3A2B] hover:text-[#D8A031]' : ''}`}>
                <Package className="w-4 h-4" /> Orders
              </button>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              <button 
                onClick={() => setIsCartOpen(true)}
                className={`relative flex items-center justify-center p-2.5 rounded-full transition-all ${isScrolled ? 'bg-[#1E3A2B]/10 text-[#1E3A2B] hover:bg-[#D8A031] hover:text-[#1E3A2B]' : 'bg-white/20 backdrop-blur-md text-white hover:bg-white/30'}`}
              >
                <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#D8A031] text-[#1E3A2B] text-[10px] md:text-xs font-bold w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </button>
              {/* Mobile Nav Toggle */}
              <button className="md:hidden p-2 rounded-full bg-white/10 text-white" onClick={() => setIsMenuOpen(true)}>
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Sidebar */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#1E3A2B]/60 backdrop-blur-sm z-50 md:hidden"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-4/5 max-w-sm bg-[#FAF7F2] shadow-2xl z-50 flex flex-col p-6"
            >
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-2">
                  <Leaf className="w-8 h-8 text-[#1E3A2B]" />
                  <span className="text-2xl font-serif font-bold text-[#1E3A2B]">Menu</span>
                </div>
                <button onClick={() => setIsMenuOpen(false)} className="p-2 bg-[#1E3A2B]/10 rounded-full text-[#1E3A2B]">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex flex-col gap-6 text-xl font-serif text-[#1E3A2B] flex-1">
                <a href="#home" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between border-b border-[#1E3A2B]/10 pb-4">Home <ArrowRight className="w-5 h-5 opacity-50" /></a>
                <a href="#products" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between border-b border-[#1E3A2B]/10 pb-4">Products <ArrowRight className="w-5 h-5 opacity-50" /></a>
                <a href="#about" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between border-b border-[#1E3A2B]/10 pb-4">About Us <ArrowRight className="w-5 h-5 opacity-50" /></a>
                <button onClick={() => { setIsMenuOpen(false); setIsOrdersOpen(true); }} className="flex items-center justify-between border-b border-[#1E3A2B]/10 pb-4 w-full text-left">
                  My Orders <Package className="w-5 h-5 opacity-50" />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section id="home" className="relative h-[100dvh] flex items-center justify-center overflow-hidden bg-[#1E3A2B]">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0 z-0">
          <video 
            ref={videoRef}
            src="/videos/hero_bg.mp4" 
            autoPlay loop muted playsInline 
            className="w-full h-full object-cover opacity-80"
          ></video>
          <div className="absolute inset-0 bg-gradient-to-b from-[#1E3A2B]/80 via-[#1E3A2B]/40 to-[#FAF7F2]"></div>
        </motion.div>
        
        {/* Floating Particles */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden mix-blend-screen opacity-30">
           <div className="absolute top-1/4 left-1/4 w-32 h-32 md:w-64 md:h-64 bg-[#D8A031] rounded-full blur-[100px] md:blur-[150px]"></div>
           <div className="absolute bottom-1/4 right-1/4 w-40 h-40 md:w-80 md:h-80 bg-[#FAF7F2] rounded-full blur-[120px] md:blur-[180px]"></div>
        </div>

        <div className="container relative z-10 px-4 md:px-8 text-center pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center"
          >
            <span className="glass inline-block px-4 md:px-6 py-1.5 md:py-2 rounded-full text-white/90 text-xs md:text-sm font-medium tracking-wide mb-6 md:mb-8 border border-white/20">
              100% Naturally Cultivated
            </span>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif text-white mb-6 leading-[1.1] max-w-5xl text-shadow-lg">
              Traditional Groceries <br className="hidden md:block"/>
              <span className="text-[#F5E9D7] italic">From Nature</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl mb-8 md:mb-12 font-light px-4">
              Chemical-free groceries grown naturally with purity, health, and traditional Indian farming values.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4">
              <a href="#products" className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#D8A031] text-[#1E3A2B] font-medium text-lg hover:bg-[#e0b04a] transition-all hover:scale-105 shadow-[0_0_20px_rgba(216,160,49,0.3)]">
                Explore Products
              </a>
              <a href="#about" className="w-full sm:w-auto px-8 py-4 rounded-full glass text-white font-medium text-lg hover:bg-white/20 transition-all hover:scale-105">
                Our Story
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20 md:py-32 bg-[#F5E9D7] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D8A031] rounded-full mix-blend-multiply filter blur-[100px] opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#1E3A2B] rounded-full mix-blend-multiply filter blur-[120px] opacity-10"></div>
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-12 md:mb-20">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }}
              className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#1E3A2B] mb-4 md:mb-6"
            >
              Our Natural Products
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="text-[#5A3E2B] text-base md:text-lg"
            >
              Experience the authentic taste and health benefits of groceries grown the way nature intended.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="h-full"
              >
                <TiltCard onClick={() => setSelectedProduct(product)} className="glass-card rounded-3xl overflow-hidden group bg-white/60">
                  <div className="relative h-56 md:h-64 overflow-hidden">
                    <img 
                      src={product.img} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-[#1E3A2B] text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                      100% Natural
                    </div>
                  </div>
                  <div className="p-6 md:p-8 flex flex-col h-[calc(100%-14rem)] md:h-[calc(100%-16rem)]">
                    <h3 className="text-2xl md:text-3xl font-serif text-[#1E3A2B] mb-2 leading-tight">{product.name}</h3>
                    <p className="text-[#5A3E2B]/80 text-sm md:text-base mb-6 flex-1 line-clamp-2">{product.shortDesc}</p>
                    
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#1E3A2B]/10">
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl md:text-2xl font-bold text-[#1E3A2B]">₹{product.price}</span>
                        <span className="text-sm text-[#5A3E2B]">{product.unit}</span>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedProduct(product); }}
                        className="w-12 h-12 rounded-full bg-[#1E3A2B] text-[#D8A031] flex items-center justify-center hover:bg-[#D8A031] hover:text-[#1E3A2B] transition-colors shadow-lg"
                      >
                        <Info className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Details Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#1E3A2B]/80 backdrop-blur-md z-[100]"
              onClick={() => setSelectedProduct(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 50 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 50 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#FAF7F2] rounded-3xl z-[101] shadow-2xl flex flex-col md:flex-row"
            >
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/50 backdrop-blur rounded-full flex items-center justify-center text-[#1E3A2B] hover:bg-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="w-full md:w-1/2 h-64 md:h-auto relative">
                <img src={selectedProduct.img} alt={selectedProduct.name} className="w-full h-full object-cover" />
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#FAF7F2] to-transparent md:hidden"></div>
              </div>
              
              <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col">
                <span className="text-[#D8A031] font-bold tracking-wider text-sm mb-2 uppercase">Premium Quality</span>
                <h2 className="text-3xl md:text-5xl font-serif text-[#1E3A2B] mb-4 leading-tight">{selectedProduct.name}</h2>
                <div className="flex items-baseline gap-2 mb-6 pb-6 border-b border-[#1E3A2B]/10">
                  <span className="text-4xl font-bold text-[#1E3A2B]">₹{selectedProduct.price}</span>
                  <span className="text-lg text-[#5A3E2B]">{selectedProduct.unit}</span>
                </div>
                <p className="text-[#5A3E2B] leading-relaxed text-lg mb-8 flex-1">
                  {selectedProduct.desc}
                </p>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center gap-2 text-[#1E3A2B]"><CheckCircle className="w-5 h-5 text-[#D8A031]"/> Organic</div>
                  <div className="flex items-center gap-2 text-[#1E3A2B]"><CheckCircle className="w-5 h-5 text-[#D8A031]"/> Chemical Free</div>
                  <div className="flex items-center gap-2 text-[#1E3A2B]"><CheckCircle className="w-5 h-5 text-[#D8A031]"/> Farm Fresh</div>
                  <div className="flex items-center gap-2 text-[#1E3A2B]"><CheckCircle className="w-5 h-5 text-[#D8A031]"/> Non-GMO</div>
                </div>
                <button 
                  onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); setIsCartOpen(true); }}
                  className="w-full py-4 rounded-xl bg-[#1E3A2B] text-white font-medium text-lg hover:bg-[#D8A031] hover:text-[#1E3A2B] transition-colors flex items-center justify-center gap-3 shadow-xl"
                >
                  <ShoppingCart className="w-5 h-5" /> Add to Cart
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#1E3A2B]/60 backdrop-blur-sm z-[110]"
              onClick={() => setIsCartOpen(false)}
            />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-[#FAF7F2] shadow-2xl z-[120] flex flex-col"
            >
              <div className="p-6 bg-[#1E3A2B] text-white flex justify-between items-center rounded-bl-3xl">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="w-6 h-6 text-[#D8A031]" />
                  <h2 className="text-2xl font-serif">Your Cart</h2>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
                {cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full opacity-50">
                    <ShoppingCart className="w-16 h-16 mb-4" />
                    <p className="text-xl font-serif">Your cart is empty</p>
                    <p className="text-sm mt-2">Add some natural goodness!</p>
                  </div>
                ) : (
                  cartItems.map(item => (
                    <motion.div layout key={item.id} className="flex gap-4 bg-white p-4 rounded-2xl shadow-sm border border-[#1E3A2B]/5">
                      <img src={item.img} alt={item.name} className="w-20 h-20 object-cover rounded-xl" />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-serif font-bold text-[#1E3A2B] leading-tight mb-1">{item.name}</h4>
                          <p className="text-sm text-[#5A3E2B] font-medium">₹{item.price} {item.unit}</p>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-3 bg-[#FAF7F2] rounded-lg px-2 py-1">
                            <button onClick={() => updateQty(item.id, -1)} className="p-1 hover:text-[#D8A031]"><Minus className="w-4 h-4"/></button>
                            <span className="font-bold w-4 text-center">{item.qty}</span>
                            <button onClick={() => updateQty(item.id, 1)} className="p-1 hover:text-[#D8A031]"><Plus className="w-4 h-4"/></button>
                          </div>
                          <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600">
                            <XCircle className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {cartItems.length > 0 && (
                <div className="p-6 bg-white border-t border-[#1E3A2B]/10 rounded-tl-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                  <div className="flex justify-between items-center mb-6 text-xl">
                    <span className="font-medium text-[#5A3E2B]">Total Estimate:</span>
                    <span className="font-bold text-3xl font-serif text-[#1E3A2B]">₹{cartTotal}</span>
                  </div>
                  <button className="w-full py-4 rounded-xl bg-[#D8A031] text-[#1E3A2B] font-bold text-lg hover:bg-[#1E3A2B] hover:text-white transition-colors shadow-lg">
                    Proceed to Checkout
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Orders Modal (Dummy) */}
      <AnimatePresence>
        {isOrdersOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#1E3A2B]/60 backdrop-blur-sm z-[110]"
              onClick={() => setIsOrdersOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#FAF7F2] rounded-3xl z-[120] p-8 shadow-2xl text-center"
            >
              <button onClick={() => setIsOrdersOpen(false)} className="absolute top-4 right-4 text-[#1E3A2B] hover:bg-[#1E3A2B]/10 p-2 rounded-full">
                <X className="w-6 h-6" />
              </button>
              <Package className="w-16 h-16 text-[#D8A031] mx-auto mb-4" />
              <h2 className="text-3xl font-serif text-[#1E3A2B] mb-2">My Orders</h2>
              <p className="text-[#5A3E2B] mb-8">Please log in to view your recent organic purchases and tracking details.</p>
              <button onClick={() => setIsOrdersOpen(false)} className="bg-[#1E3A2B] text-white w-full py-3 rounded-xl font-medium hover:bg-[#D8A031] hover:text-[#1E3A2B] transition-colors">
                Log In / Register
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer id="contact" className="bg-[#152a1f] pt-20 md:pt-32 pb-10 relative mt-20">
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 text-center md:text-left">
            <div className="col-span-1 md:col-span-2 lg:col-span-1 flex flex-col items-center md:items-start">
              <div className="flex items-center gap-2 mb-6">
                <Leaf className="w-8 h-8 text-[#D8A031]" />
                <span className="text-3xl font-serif font-bold text-white">Amruteswari</span>
              </div>
              <p className="text-white/70 text-sm mb-8 max-w-sm leading-relaxed">
                Purely Natural. Purely Traditional. Bringing the best of Indian organic farming to your kitchen.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-serif text-xl mb-6">Quick Links</h4>
              <ul className="flex flex-col gap-4 text-white/70 text-sm">
                <li><a href="#home" className="hover:text-[#D8A031] transition-colors">Home</a></li>
                <li><a href="#about" className="hover:text-[#D8A031] transition-colors">About Us</a></li>
                <li><a href="#products" className="hover:text-[#D8A031] transition-colors">Our Products</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-serif text-xl mb-6">Contact</h4>
              <ul className="flex flex-col gap-4 text-white/70 text-sm">
                <li>123 Traditional Farm Road</li>
                <li>Agricultural District, India</li>
                <li className="mt-2 text-[#D8A031] font-medium text-lg">hello@amruteswari.com</li>
                <li className="text-[#D8A031] font-medium text-lg">+91 98765 43210</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between text-white/40 text-sm gap-4">
            <p>© 2026 Amruteswari Satvik Foods. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

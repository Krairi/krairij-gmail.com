import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  ArrowRight, 
  Check, 
  Menu, 
  X
} from 'lucide-react';
import { NeoButton } from './components/NeoButton';
import { DashboardDemo } from './components/DashboardDemo';
import { DownloadModal } from './components/DownloadModal';
import { VideoModal } from './components/VideoModal';

interface NavbarProps {
  onDownloadClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onDownloadClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  // Scroll Spy Logic
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['fonctionnalites', 'demonstration', 'tarifs', 'en-savoir-plus'];
      // Offset de 100px pour compenser la navbar fixe
      const scrollPosition = window.scrollY + 100; 

      let current = '';
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            current = section;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Hauteur de la navbar
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setIsOpen(false);
    }
  };

  const getLinkClass = (id: string) => `
    font-medium transition-all duration-200 relative cursor-pointer
    ${activeSection === id ? 'text-givd-blue font-bold' : 'text-givd-dark hover:text-givd-blue'}
    ${activeSection === id ? 'after:content-[""] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[2px] after:bg-givd-blue' : ''}
  `;

  return (
    <nav className="fixed w-full bg-white/90 backdrop-blur-md border-b-2 border-givd-dark z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center gap-2">
            <div className="w-8 h-8 bg-givd-blue border-2 border-givd-dark shadow-neo-sm"></div>
            <span className="font-display font-bold text-xl tracking-tight">GIVD.</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a 
              href="#fonctionnalites" 
              onClick={(e) => scrollToSection(e, 'fonctionnalites')} 
              className={getLinkClass('fonctionnalites')}
            >
              Fonctionnalités
            </a>
            <a 
              href="#demonstration" 
              onClick={(e) => scrollToSection(e, 'demonstration')} 
              className={getLinkClass('demonstration')}
            >
              Démonstration
            </a>
            <a 
              href="#tarifs" 
              onClick={(e) => scrollToSection(e, 'tarifs')} 
              className={getLinkClass('tarifs')}
            >
              Tarifs
            </a>
            <NeoButton size="sm" variant="primary" onClick={onDownloadClick}>Télécharger</NeoButton>
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b-2 border-givd-dark">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col gap-4 p-4">
             <a href="#fonctionnalites" onClick={(e) => scrollToSection(e, 'fonctionnalites')} className="block text-givd-dark font-bold text-lg">Fonctionnalités</a>
             <a href="#demonstration" onClick={(e) => scrollToSection(e, 'demonstration')} className="block text-givd-dark font-bold text-lg">Démonstration</a>
             <a href="#tarifs" onClick={(e) => scrollToSection(e, 'tarifs')} className="block text-givd-dark font-bold text-lg">Tarifs</a>
             <NeoButton className="w-full" onClick={() => { setIsOpen(false); onDownloadClick(); }}>Télécharger l'App</NeoButton>
          </div>
        </div>
      )}
    </nav>
  );
};

const Hero = ({ onDownloadClick, onDemoClick }: { onDownloadClick: () => void; onDemoClick: () => void }) => (
  <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
    <div className="text-center max-w-4xl mx-auto mb-12">
      <h1 className="font-display font-bold text-5xl md:text-7xl leading-none tracking-tight mb-6">
        Domptez votre <br/>
        <span className="bg-givd-blue text-white px-4 border-2 border-givd-dark shadow-neo inline-block rotate-[-2deg]">logistique</span>
        <span className="bg-givd-green text-givd-dark px-4 border-2 border-givd-dark shadow-neo inline-block rotate-[1deg] ml-2">domestique.</span>
      </h1>
      <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto font-medium">
        L'assistant intelligent qui scanne vos tickets, surveille vos stocks et automatise vos courses.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <NeoButton size="lg" variant="primary" onClick={onDownloadClick} className="w-full sm:w-auto flex items-center gap-2 justify-center">
          Tester gratuitement <ArrowRight size={20} />
        </NeoButton>
        <NeoButton size="lg" variant="secondary" className="w-full sm:w-auto" onClick={onDemoClick}>
          Voir la démo
        </NeoButton>
      </div>
    </div>
    
    <div className="relative mt-16 scroll-mt-28" id="demonstration">
      <div className="absolute top-[-20px] left-1/2 -translate-x-1/2 bg-givd-orange px-6 py-2 border-2 border-givd-dark shadow-neo z-10 font-bold -rotate-2">
        DÉMONSTRATION INTERACTIVE
      </div>
      <DashboardDemo />
    </div>
  </section>
);

const Features = () => (
  <section id="fonctionnalites" className="py-24 bg-white border-y-2 border-givd-dark scroll-mt-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-16 text-center">
        <h2 className="font-display font-bold text-4xl mb-4">Une intelligence brute.</h2>
        <p className="text-xl text-gray-600">Tout ce dont vous avez besoin pour ne plus jamais manquer de rien.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {[
          {
            icon: "🧾",
            title: "Scan OCR & IA",
            desc: "Scannez vos tickets de caisse. L’IA extrait les produits, quantités et prix pour mettre à jour les stocks automatiquement.",
            color: "bg-givd-blue"
          },
          {
            icon: "📊",
            title: "Suivi de Consommation",
            desc: "Visualisez la consommation de votre foyer en temps réel. GIVD anticipe les ruptures.",
            color: "bg-givd-green"
          },
          {
            icon: "🔄",
            title: "Automatisation des Achats",
            desc: "Les produits proches du seuil sont automatiquement ajoutés à la liste de courses connectée au Drive ou service de livraison.",
            color: "bg-givd-orange"
          }
        ].map((feature, idx) => (
          <div key={idx} className="bg-white p-8 border-2 border-givd-dark shadow-neo hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[8px_8px_0px_0px_#1F1F1F] transition-all">
            <div className={`w-16 h-16 ${feature.color} border-2 border-givd-dark flex items-center justify-center mb-6 shadow-neo-sm text-3xl`}>
              {feature.icon}
            </div>
            <h3 className="font-display font-bold text-2xl mb-4">{feature.title}</h3>
            <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const HowItWorks = () => (
  <section className="py-24 bg-[#f3f4f6]">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="font-display font-bold text-4xl mb-16 text-center">Comment ça marche ?</h2>
      
      <div className="relative">
        <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-givd-dark -translate-y-1/2 z-0"></div>
        <div className="grid md:grid-cols-3 gap-12 relative z-10">
          {[
            { step: "01", title: "Scanner", text: "Ticket de caisse ou code-barre." },
            { step: "02", title: "Analyser", text: "Dashboard de suivi en temps réel." },
            { step: "03", title: "Optimiser", text: "Alertes et réapprovisionnement auto." }
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-8 border-2 border-givd-dark text-center shadow-neo">
              <div className="inline-block bg-givd-dark text-white font-display font-bold text-xl px-4 py-2 mb-4 -rotate-3 border-2 border-white outline outline-2 outline-givd-dark">
                {item.step}
              </div>
              <h3 className="font-display font-bold text-2xl mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const Pricing = ({ onDownloadClick }: { onDownloadClick: () => void }) => (
  <section id="tarifs" className="py-24 bg-white border-y-2 border-givd-dark scroll-mt-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="font-display font-bold text-4xl mb-4">Des tarifs transparents.</h2>
        <p className="text-xl text-gray-600">Investissez dans votre tranquillité d'esprit. Annulation possible à tout moment.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 items-start">
        {/* Starter Plan */}
        <div className="bg-white p-8 border-2 border-givd-dark shadow-neo relative">
          <h3 className="font-display font-bold text-2xl mb-2">Starter</h3>
          <p className="text-gray-500 mb-6">Pour découvrir GIVD.</p>
          <div className="mb-6">
            <span className="text-4xl font-bold">Gratuit</span>
          </div>
          <ul className="space-y-4 mb-8">
            <li className="flex items-center gap-3"><Check size={20} className="text-givd-green" /> <span>Jusqu'à 50 produits</span></li>
            <li className="flex items-center gap-3"><Check size={20} className="text-givd-green" /> <span>5 Scans OCR / mois</span></li>
            <li className="flex items-center gap-3"><Check size={20} className="text-givd-green" /> <span>Suivi conso basique</span></li>
          </ul>
          <NeoButton variant="secondary" className="w-full" onClick={onDownloadClick}>Commencer</NeoButton>
        </div>

        {/* Smart Plan (Highlighted) */}
        <div className="bg-givd-dark text-white p-8 border-2 border-givd-dark shadow-[8px_8px_0px_0px_#3A7AFE] relative transform md:-translate-y-4">
          <div className="absolute top-0 right-0 bg-givd-blue text-white text-xs font-bold px-3 py-1 border-b-2 border-l-2 border-white">POPULAIRE</div>
          <h3 className="font-display font-bold text-2xl mb-2 text-givd-blue">Smart</h3>
          <p className="text-gray-400 mb-6">L'expérience complète.</p>
          <div className="mb-6">
            <span className="text-4xl font-bold">4.99€</span><span className="text-gray-400">/mois</span>
          </div>
          <ul className="space-y-4 mb-8">
            <li className="flex items-center gap-3"><Check size={20} className="text-givd-blue" /> <span>Produits illimités</span></li>
            <li className="flex items-center gap-3"><Check size={20} className="text-givd-blue" /> <span>Scans OCR illimités</span></li>
            <li className="flex items-center gap-3"><Check size={20} className="text-givd-blue" /> <span>Liaison Drive auto</span></li>
            <li className="flex items-center gap-3"><Check size={20} className="text-givd-blue" /> <span>Mode hors-ligne</span></li>
          </ul>
          <NeoButton variant="primary" className="w-full border-white" onClick={onDownloadClick}>Choisir Smart</NeoButton>
        </div>

        {/* Family Plan */}
        <div className="bg-white p-8 border-2 border-givd-dark shadow-neo relative">
          <h3 className="font-display font-bold text-2xl mb-2">Family</h3>
          <p className="text-gray-500 mb-6">Pour toute la maison.</p>
          <div className="mb-6">
            <span className="text-4xl font-bold">9.99€</span><span className="text-gray-400">/mois</span>
          </div>
          <ul className="space-y-4 mb-8">
            <li className="flex items-center gap-3"><Check size={20} className="text-givd-green" /> <span>Tout du plan Smart</span></li>
            <li className="flex items-center gap-3"><Check size={20} className="text-givd-green" /> <span>Jusqu'à 5 utilisateurs</span></li>
            <li className="flex items-center gap-3"><Check size={20} className="text-givd-green" /> <span>Multi-logements</span></li>
            <li className="flex items-center gap-3"><Check size={20} className="text-givd-green" /> <span>Suggestions recettes</span></li>
          </ul>
          <NeoButton variant="secondary" className="w-full" onClick={onDownloadClick}>Choisir Family</NeoButton>
        </div>
      </div>
    </div>
  </section>
);

const SocialProof = () => (
  <section className="py-24 bg-givd-blue text-white border-y-2 border-givd-dark">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 className="font-display font-bold text-3xl md:text-5xl mb-12">
        "La fin de la charge mentale des courses."
      </h2>
      <div className="grid md:grid-cols-3 gap-8">
        {[
          { name: "Sophie M.", role: "Mère de 3 enfants", quote: "Je ne jette plus rien. GIVD me prévient avant que les produits périment." },
          { name: "Thomas L.", role: "Étudiant", quote: "Idéal pour gérer les courses de la colocation sans se prendre la tête sur qui a acheté quoi." },
          { name: "Marc D.", role: "Geek & Minimaliste", quote: "L'interface est incroyable. Pas de fioritures, juste de la data utile." }
        ].map((review, idx) => (
          <div key={idx} className="bg-white text-givd-dark p-6 border-2 border-givd-dark shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] text-left">
            <div className="flex gap-1 mb-4 text-givd-orange">
              {[...Array(5)].map((_, i) => <Zap key={i} size={16} fill="currentColor" />)}
            </div>
            <p className="italic mb-4">"{review.quote}"</p>
            <div className="font-bold font-display">{review.name}</div>
            <div className="text-sm text-gray-500">{review.role}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const LearnMore = () => (
  <section id="en-savoir-plus" className="py-24 bg-white border-t-2 border-givd-dark scroll-mt-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-givd-blue text-white p-8 md:p-12 border-2 border-givd-dark shadow-neo relative overflow-hidden">
         {/* Abstract background shape for visual flair */}
         <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-20 rounded-full blur-3xl"></div>
         
         <div className="relative z-10 max-w-3xl">
            <h2 className="font-display font-bold text-3xl md:text-5xl mb-6">En savoir plus</h2>
            <p className="text-xl md:text-2xl font-medium leading-relaxed opacity-90">
              Découvrez comment notre assistant intelligent GIVD révolutionne la gestion de la vie domestique grâce à l’analyse en temps réel des consommations, aux alertes de stock automatisées, et à la planification intelligente des courses.
            </p>
         </div>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-givd-dark text-white pt-16 pb-8 border-t-2 border-givd-dark">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-4 gap-12 mb-12">
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-givd-blue border border-white"></div>
            <span className="font-display font-bold text-2xl">GIVD.</span>
          </div>
          <p className="text-gray-400 text-sm">
            Gestionnaire Intelligent de Vie Domestique.
            <br/>Simplifiez votre quotidien.
          </p>
        </div>
        
        <div>
          <h4 className="font-display font-bold mb-4 text-givd-green">Produit</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><a href="#fonctionnalites" className="hover:text-white">Fonctionnalités</a></li>
            <li><a href="#" className="hover:text-white">Intégrations Drive</a></li>
            <li><a href="#" className="hover:text-white">Scanner OCR</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-display font-bold mb-4 text-givd-blue">Légal</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><a href="#" className="hover:text-white">Confidentialité</a></li>
            <li><a href="#" className="hover:text-white">CGU</a></li>
            <li><a href="#" className="hover:text-white">Données personnelles</a></li>
          </ul>
        </div>

        <div>
           <h4 className="font-display font-bold mb-4 text-givd-orange">Contact</h4>
           <p className="text-gray-400 text-sm mb-4">hello@givd.app</p>
           <div className="flex gap-4">
             {/* Social placeholders */}
             <div className="w-8 h-8 bg-white/10 hover:bg-white/20 transition-colors"></div>
             <div className="w-8 h-8 bg-white/10 hover:bg-white/20 transition-colors"></div>
           </div>
        </div>
      </div>
      
      <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
        © 2024 GIVD Inc. Tous droits réservés.
      </div>
    </div>
  </footer>
);

export default function App() {
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Generic function to scroll to any section ID with proper offset
  const scrollToId = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen font-sans text-givd-dark selection:bg-givd-green selection:text-givd-dark">
      <Navbar onDownloadClick={() => setIsDownloadModalOpen(true)} />
      <Hero 
        onDownloadClick={() => setIsDownloadModalOpen(true)} 
        onDemoClick={() => scrollToId('demonstration')}
      />
      <Features />
      <HowItWorks />
      <Pricing onDownloadClick={() => setIsDownloadModalOpen(true)} />
      <SocialProof />
      
      <section className="py-24 max-w-4xl mx-auto px-4 text-center">
        <div className="bg-givd-green border-2 border-givd-dark shadow-neo p-8 md:p-16">
          <h2 className="font-display font-bold text-3xl md:text-5xl mb-6">Prêt à optimiser votre foyer ?</h2>
          <p className="text-xl mb-8 font-medium">Rejoignez les 10,000 foyers qui ne manquent plus jamais de café.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <NeoButton size="lg" className="bg-givd-dark text-white hover:bg-black" onClick={() => setIsDownloadModalOpen(true)}>
              Créer un compte
            </NeoButton>
            <NeoButton size="lg" variant="secondary" onClick={() => scrollToId('en-savoir-plus')}>
              En savoir plus
            </NeoButton>
          </div>
        </div>
      </section>

      <LearnMore />

      <Footer />
      
      <DownloadModal 
        isOpen={isDownloadModalOpen} 
        onClose={() => setIsDownloadModalOpen(false)} 
      />
      <VideoModal 
        isOpen={isVideoModalOpen} 
        onClose={() => setIsVideoModalOpen(false)} 
      />
    </div>
  );
}
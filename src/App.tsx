import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react'
import {
  ArrowDownRight, ArrowRight, ArrowUpRight, BadgeCheck, Check, CheckCircle2, ChevronDown,
  ChevronRight, Clock3, Coffee, FileText, Image as ImageIcon, Camera, LayoutDashboard,
  Mail, MapPin, Menu, MessageCircle, Package, Palette, Phone, Printer, Search, Shirt,
  Sparkles, Upload, Users, X, Flag, Layers, Eye, Plus
} from 'lucide-react'

type Service = {
  slug: string
  title: string
  category: string
  short: string
  detail: string
  turnaround: string
  image: string
  alt: string
  icon: 'flyer' | 'shirt' | 'banner' | 'mug' | 'book' | 'pack' | 'art' | 'business' | 'design' | 'event' | 'finish' | 'document' | 'signage'
  visible?: boolean
}
type Project = { title: string; client: string; category: string; image: string; alt: string; note: string }
type Quote = { id: string; name: string; email: string; company: string; service: string; details: string; status: string; received: string; files: string[] }
type AdminTab = 'overview' | 'services' | 'quotations' | 'portfolio'

const photo = (id: string, width = 1200) => 'https://images.unsplash.com/' + id + '?auto=format&fit=crop&w=' + width + '&q=88'
const localImage = (file: string) => '/images/' + file
const SERVICES: Service[] = [
  { slug: 'digital-offset', title: 'Digital & Offset Printing', category: 'Commercial print', short: 'Flexible print runs for everyday jobs and big production needs.', detail: 'Digital and offset printing for short runs, larger quantities and projects that need precise colour. We can help choose a print process based on your artwork, schedule and quantity.', turnaround: '3–7 working days', image: localImage('ag-print-production.jpg'), alt: 'Commercial printing equipment beside finished sample brochures and cards', icon: 'flyer' },
  { slug: 'large-format', title: 'Large Format Printing', category: 'Large format', short: 'Banners, posters and billboards made to be seen from afar.', detail: 'Large-format prints for indoor displays, shopfronts, events and outdoor campaigns. Ask about banners, posters, billboard graphics, sizes and finishing options.', turnaround: '2–5 working days', image: localImage('ag-large-format.jpg'), alt: 'Large format printer producing a colourful event banner', icon: 'banner' },
  { slug: 'business-stationery', title: 'Business Cards & Corporate Stationery', category: 'Business print', short: 'A polished, consistent look across your business essentials.', detail: 'Business cards, letterheads, envelopes, folders and other corporate stationery. Select a paper stock and finish that feels right for your brand.', turnaround: '3–5 working days', image: localImage('ag-print-production.jpg'), alt: 'Printed business cards and corporate stationery from a print shop', icon: 'business' },
  { slug: 'marketing-print', title: 'Flyers, Brochures & Magazines', category: 'Marketing print', short: 'Put your message in people’s hands with crisp, colourful print.', detail: 'Flyers, folded brochures, catalogues and magazines in a range of sizes, paper stocks and bindings. Share your artwork and quantity to get a tailored quote.', turnaround: '3–7 working days', image: localImage('ag-print-production.jpg'), alt: 'Printed brochures and magazines beside commercial printing equipment', icon: 'flyer' },
  { slug: 'textile-printing', title: 'T-shirt & Textile Printing', category: 'Apparel & textile', short: 'Custom garments for teams, events, uniforms and merchandise.', detail: 'Custom printing on T-shirts and selected textiles. Tell us about the garments, print placement, colours and quantity, and we can advise on a suitable approach.', turnaround: '5–8 working days', image: localImage('ag-promotional-merch.jpg'), alt: 'Custom branded T-shirts and promotional merchandise', icon: 'shirt' },
  { slug: 'mugs-promo-items', title: 'Mugs & Promotional Items', category: 'Custom print', short: 'Branded mugs and useful printed gifts for teams and events.', detail: 'Custom printed mugs and selected promotional items for gifts, launches and staff packs. Share your artwork and quantity so the AG team can recommend suitable items.', turnaround: '5–8 working days', image: localImage('ag-promotional-merch.jpg'), alt: 'Branded mugs, T-shirts and promotional gifts', icon: 'mug' },
  { slug: 'packaging-labels', title: 'Packaging & Label Printing', category: 'Packaging & labels', short: 'Custom labels and packaging that make products stand out.', detail: 'Product labels, stickers, sleeves, cartons and packaging materials for small-batch and larger projects. Custom sizes and finishes can be discussed with the team.', turnaround: '5–10 working days', image: photo('photo-1669292618143-8e0337388811'), alt: 'A printed label applied to a cardboard package', icon: 'pack' },
  { slug: 'graphic-design', title: 'Graphic Design Services', category: 'Design & finishing', short: 'Get thoughtful help taking your idea from concept to print-ready.', detail: 'Design assistance for print projects, including layout, artwork preparation and finishing touches. Share your references and goals so we can understand the help you need.', turnaround: 'Timing confirmed per brief', image: photo('photo-1791197738079-d25b54cd42dc'), alt: 'A laptop displaying a graphic design workspace', icon: 'design' },
  { slug: 'invitations-programmes', title: 'Invitation & Event Programme Printing', category: 'Events & books', short: 'Printed details that make a gathering feel special.', detail: 'Invitations, menus, event programmes and other printed pieces for weddings, celebrations and business events. Ask about paper, folds, finishes and coordinated sets.', turnaround: '3–7 working days', image: photo('photo-1529066496421-d8fb2dca38a6'), alt: 'A printed invitation card with a matching envelope', icon: 'event' },
  { slug: 'book-printing', title: 'Book Printing & Binding', category: 'Events & books', short: 'Books, reports and booklets finished with care.', detail: 'Booklets, short-run books, catalogues and reports. The team can help choose paper, cover stock, binding style and a suitable print run.', turnaround: '5–10 working days', image: localImage('ag-book-printing.jpg'), alt: 'A finished hardback book and its printed dust jacket', icon: 'book' },
  { slug: 'lamination-finishing', title: 'Lamination & Finishing', category: 'Design & finishing', short: 'Give printed pieces the protection and finish they deserve.', detail: 'Lamination and finishing options to protect, enhance or prepare printed materials. Share the item, quantity and intended use and we can recommend available finishes.', turnaround: 'Timing varies by project', image: photo('photo-1693031630146-568e2f72db0e'), alt: 'A production machine trimming a printed sheet', icon: 'finish' },
  { slug: 'stickers-custom', title: 'Stickers & Customized Printing', category: 'Custom print', short: 'Custom printed details for products, packaging and promotions.', detail: 'Custom stickers and one-off printed items for packaging, promotions, events and personal projects. Tell us about the surface, size, quantity and how the print will be used.', turnaround: '3–7 working days', image: photo('photo-1625768376503-68d2495d78c5'), alt: 'A wall covered with assorted stickers', icon: 'art' },
  { slug: 'signage-vehicle-branding', title: 'Signage & Vehicle Branding', category: 'Signs & branding', short: 'Help your business get noticed on walls, windows and the road.', detail: 'Business signage, window graphics and vehicle branding to help your organisation stand out. Share your dimensions, surfaces and artwork for a project-specific quote.', turnaround: 'Timing confirmed per project', image: photo('photo-1583559121633-63421224a8e1'), alt: 'A branded vehicle showing a printed vehicle wrap', icon: 'signage' },
  { slug: 'copy-scan-documents', title: 'Photocopying, Scanning & Document Printing', category: 'Document services', short: 'Reliable help with everyday documents and copies.', detail: 'Photocopying, scanning and document printing for reports, forms, presentations and other everyday needs. Ask us about file formats, page counts and available turnaround.', turnaround: 'Ask us about availability', image: photo('photo-1650094980833-7373de26feb6'), alt: 'An office printer and photocopier ready for document jobs', icon: 'document' },
]

const PROJECTS: Project[] = [
  { title: 'Good ideas, passed around', client: 'Common Ground', category: 'Flyers', image: localImage('ag-print-production.jpg'), alt: 'Finished printed brochures and cards from a sample print run', note: 'A bright, compact flyer run for a neighbourhood market launch.' },
  { title: 'Made to move together', client: 'Good People Studio', category: 'T-shirts', image: localImage('ag-promotional-merch.jpg'), alt: 'A collection of branded T-shirts and promotional items', note: 'Team shirts for a busy season of community events.' },
  { title: 'Seen across the room', client: 'Field Day Market', category: 'Banners', image: localImage('ag-large-format.jpg'), alt: 'Colourful large format banner coming off the press', note: 'Oversized event graphics built for a bustling weekend.' },
  { title: 'A cup with a story', client: 'Sunday Provisions', category: 'Mugs', image: localImage('ag-promotional-merch.jpg'), alt: 'Branded cups and promotional merchandise', note: 'A small collection of branded mugs made for gifting.' },
  { title: 'Field notes, volume four', client: 'Morrow Studio', category: 'Books', image: localImage('ag-book-printing.jpg'), alt: 'A finished hardback book with a printed cover', note: 'A short-run studio journal with a colourful cover and careful binding.' },
  { title: 'A little more shelf appeal', client: 'Sunday Provisions', category: 'Packaging', image: photo('photo-1602143407151-7111542de6e8'), alt: 'Custom product packaging on a bottle', note: 'Product labels and packaging for a small-batch launch.' },
  { title: 'Colour for the walls', client: 'Lena Morrow', category: 'Art prints', image: photo('photo-1579783902614-a3fb3927b6a5'), alt: 'Framed art print in a gallery', note: 'Carefully matched art reproductions for a studio collection.' },
  { title: 'A good first impression', client: 'Practice Space', category: 'Business print', image: photo('photo-1605100804763-247f67b3557e'), alt: 'Printed business cards and stationery', note: 'A tactile stationery set for a growing creative practice.' },
  { title: 'Details worth keeping', client: 'Gather Studio', category: 'Invitations', image: photo('photo-1455390582262-044cdead277a'), alt: 'Paper invitations and creative notes', note: 'A coordinated invitation and programme suite for an event.' },
  { title: 'Tiny marks, big personality', client: 'Sunday Provisions', category: 'Stickers', image: photo('photo-1602143407151-7111542de6e8'), alt: 'Product labels and sticker details', note: 'Custom label pieces for a small-batch product range.' },
  { title: 'Find your way in', client: 'Field Day Market', category: 'Signage', image: photo('photo-1540575467063-178a50c2df30'), alt: 'Directional signage in a busy event venue', note: 'A family of event signs designed to keep visitors moving.' },
  { title: 'Ready for the road', client: 'Common Ground', category: 'Vehicle branding', image: photo('photo-1559056199-641a0ac8b55e'), alt: 'Business branding and custom labels', note: 'A sample branding concept for a local delivery vehicle.' },
]

const FAQ = [
  ['What can AG print?', 'AG offers digital and offset printing; banners, posters and billboards; business cards and stationery; flyers, brochures and magazines; T-shirt and textile printing; packaging and labels; graphic design; invitations and event programmes; books and binding; lamination and finishing; stickers and custom printing; signage and vehicle branding; and photocopying, scanning and document printing.'],
  ['How do I get a quote?', 'Choose a service and tell us what you need, including an approximate quantity and date. Add artwork if you have it. A member of the team can then review the details and prepare a quote.'],
  ['Do I need finished artwork?', 'Not at all. Print-ready files are helpful, but a sketch, reference or clear description is a good place to begin.'],
  ['How long will my project take?', 'Turnaround depends on the service, quantity and finish. The examples on this site are indicative only; AG will confirm timing when responding to your enquiry.'],
]

const DEMO_QUOTES: Quote[] = [
  { id: 'AG-Q-1048', name: 'Morrow Studio', email: 'studio@example.com', company: 'Morrow Studio', service: 'Books & booklets', details: 'Autumn lookbook · 250 copies', status: 'Needs review', received: 'Today', files: [] },
  { id: 'AG-Q-1047', name: 'Lena Morrow', email: 'lena@example.com', company: 'Lena Morrow', service: 'Art & large prints', details: 'Art prints · 30 copies', status: 'In progress', received: 'Yesterday', files: [] },
  { id: 'AG-Q-1046', name: 'Good People Coffee', email: 'hello@example.com', company: 'Good People Coffee', service: 'Packaging & labels', details: 'Packaging sleeves · 1,000', status: 'Quote sent', received: 'Nov 02', files: [] },
  { id: 'AG-Q-1045', name: 'Common Ground', email: 'team@example.com', company: 'Common Ground', service: 'Flyers & leaflets', details: 'Event flyers · 500 copies', status: 'Needs review', received: 'Nov 01', files: [] },
]

function Icon({ name, size = 21 }: { name: Service['icon']; size?: number }) {
  if (name === 'shirt') return <Shirt size={size} />
  if (name === 'banner') return <Flag size={size} />
  if (name === 'mug') return <Coffee size={size} />
  if (name === 'book') return <FileText size={size} />
  if (name === 'pack') return <Package size={size} />
  if (name === 'art' || name === 'design') return <Palette size={size} />
  if (name === 'finish') return <CheckCircle2 size={size} />
  if (name === 'event' || name === 'document') return <FileText size={size} />
  if (name === 'signage') return <Flag size={size} />
  if (name === 'business') return <Layers size={size} />
  return <Printer size={size} />
}

function Photo({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false)
  return <div className={'photo ' + className}>
    {!failed && <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} />}
    {failed && <div className="photo-fallback" aria-label={alt}><Printer size={28} /><span>AG · PRINT STUDIO</span></div>}
  </div>
}

function Brand({ go }: { go: () => void }) {
  return <button className="brand" onClick={go} aria-label="AG home">
    <span className="brand-mark">AG</span>
    <span className="brand-copy">PRINT<span>STUDIO</span></span>
  </button>
}

function DemoNote() {
  return <div className="demo-note"><Sparkles size={13} /><span><b>AG WEBSITE PREVIEW</b><i /> Sample details · quote form stays in this browser</span></div>
}

function Header({ go }: { go: (path: string) => void }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const jump = (path: string) => { go(path); setMenuOpen(false) }
  return <header className="site-header">
    <div className="nav-wrap">
      <Brand go={() => jump('home')} />
      <nav className={menuOpen ? 'main-nav is-open' : 'main-nav'} aria-label="Main navigation">
        <button onClick={() => jump('home')}>Home</button>
        <button onClick={() => jump('about')}>About us</button>
        <button onClick={() => jump('services')}>Services <ChevronDown size={13} /></button>
        <button onClick={() => jump('portfolio')}>Our work</button>
        <button onClick={() => jump('contact')}>Contact</button>
        <button className="mobile-quote" onClick={() => jump('quote')}>Request a quote <ArrowRight size={15} /></button>
      </nav>
      <div className="nav-cta">
        <a className="phone-link" href="tel:+0000000000"><Phone size={14} /> <span>Talk to our team</span></a>
        <button className="button button-lime button-small" onClick={() => jump('quote')}>Request a quote <ArrowUpRight size={15} /></button>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'}>{menuOpen ? <X /> : <Menu />}</button>
      </div>
    </div>
  </header>
}

function Footer({ go }: { go: (path: string) => void }) {
  return <footer className="footer">
    <div className="footer-main">
      <div className="footer-brand"><Brand go={() => go('home')} /><p>Good ideas deserve<br />good print.</p><a className="social-link" href="https://instagram.com" aria-label="Instagram"><Camera size={17} /></a></div>
      <div className="footer-column"><b>EXPLORE</b><button onClick={() => go('services')}>What we print</button><button onClick={() => go('portfolio')}>Our work</button><button onClick={() => go('about')}>About AG</button><button onClick={() => go('contact')}>Contact & FAQs</button></div>
      <div className="footer-column"><b>START A PROJECT</b><button onClick={() => go('quote')}>Request a quote</button><button onClick={() => go('admin')}>Admin preview ↗</button><small>Quote enquiries are simulated in this preview.</small></div>
      <div className="footer-address"><b>COME SAY HELLO</b><p><MapPin size={15} /> Studio address placeholder<br /><span>Replace with AG’s location</span></p><a href="mailto:hello@ag.example"><Mail size={15} /> hello@ag.example</a><small>Sample contact details · replace before launch</small></div>
    </div>
    <div className="footer-bottom"><span>© 2026 AG Print Studio · Concept preview</span><span>Thoughtfully printed, together.</span></div>
  </footer>
}

function Eyebrow({ children }: { children: ReactNode }) { return <div className="eyebrow"><i />{children}</div> }
function SectionHead({ eyebrow, title, text, link, action }: { eyebrow: string; title: ReactNode; text?: string; link?: string; action?: () => void }) {
  return <div className="section-head"><div><Eyebrow>{eyebrow}</Eyebrow><h2>{title}</h2>{text && <p>{text}</p>}</div>{link && <button className="text-link" onClick={action}>{link}<ArrowUpRight size={16} /></button>}</div>
}

function Home({ go, services, openProject }: { go: (path: string) => void; services: Service[]; openProject: (p: Project) => void }) {
  const popular = ['large-format', 'mugs-promo-items', 'book-printing']
    .map(slug => services.find(service => service.slug === slug))
    .filter((service): service is Service => Boolean(service))
  return <>
    <main>
      <section className="hero">
        <div className="hero-copy">
          <div className="hero-pill"><span /> PRINTED WITH PURPOSE</div>
          <h1>Print that<br />makes <em>an impact.</em></h1>
          <p>From everyday business essentials to bold banners and custom merch, let’s make something people remember.</p>
          <div className="hero-buttons"><button className="button button-lime" onClick={() => go('quote')}>Get a quote <ArrowRight size={17} /></button><button className="button button-text" onClick={() => go('services')}>Explore services <ArrowDownRight size={17} /></button></div>
          <div className="hero-caption-line"><span className="mini-avatars"><i>A</i><i>G</i><i>+</i></span><span><b>Good ideas, made tangible.</b><small>Friendly help from first draft to finished print.</small></span></div>
        </div>
        <div className="hero-gallery" aria-label="Examples of AG print services">
          <div className="hero-main-photo"><Photo src={localImage('ag-large-format.jpg')} alt="A large format printer producing colourful banner graphics" className="hero-shirt" /><span className="photo-tag"><Printer size={15} /> LARGE FORMAT PRINTING</span></div>
          <div className="hero-small-photo hero-flyer"><Photo src={localImage('ag-print-production.jpg')} alt="Printed brochures and cards from a print production run" /><span className="photo-tag"><Printer size={14} /> PRINT & FINISH</span></div>
          <div className="hero-small-photo hero-mug"><Photo src={localImage('ag-promotional-merch.jpg')} alt="Custom branded merchandise including T-shirts and mugs" /><span className="photo-tag"><Coffee size={14} /> CUSTOM MERCH</span></div>
          <div className="hero-note-card"><span className="note-spark">✳</span><b>Print it<br />your way.</b><small>Small runs welcome</small></div>
          <div className="hero-index">AG <i /> PRINT STUDIO</div>
        </div>
      </section>
      <div className="trust-strip"><div><BadgeCheck /><span><b>Digital & offset</b><small>Reliable everyday print</small></span></div><div><MessageCircle /><span><b>Large format</b><small>Banners, posters & signs</small></span></div><div><Package /><span><b>Custom apparel</b><small>Shirts, mugs & merch</small></span></div><div><CheckCircle2 /><span><b>Books & booklets</b><small>Printed and bound with care</small></span></div></div>

      <section className="section services-home">
        <SectionHead eyebrow="POPULAR SERVICES" title={<>Good print for<br /><em>every kind of idea.</em></>} text="From custom merchandise to books made to last, explore the services our customers ask for most." link="See all services" action={() => go('services')} />
        <div className="service-cards">{popular.map((s, i) => <button className={'service-card service-card-' + i} key={s.slug} onClick={() => go('service/' + s.slug)}>
          <div className="service-photo"><Photo src={s.image} alt={s.alt} /><span className="service-icon-badge"><Icon name={s.icon} size={19} /></span><span className="photo-arrow"><ArrowUpRight size={18} /></span></div>
          <div className="service-card-copy"><span>{s.category}</span><h3>{s.title}</h3><p>{s.short}</p></div>
        </button>)}</div>
      </section>

      <section className="section journey-section"><div className="journey-heading"><Eyebrow>HOW IT WORKS</Eyebrow><h2>Good print starts with<br /><em>a simple conversation.</em></h2><p>Share the idea, explore your options, then get a quote that fits.</p></div><div className="journey-steps"><button className="journey-step" onClick={() => go('services')}><span className="step-number">01</span><span className="step-icon"><Search size={19} /></span><b>Choose your service</b><small>Find the print that suits your project.</small><span className="step-link">Explore services <ArrowRight size={14} /></span></button><button className="journey-step journey-step-featured" onClick={() => go('quote')}><span className="step-number">02</span><span className="step-icon"><Upload size={19} /></span><b>Share your idea</b><small>Tell us what you need. Add artwork if you have it.</small><span className="step-link">Start a quote <ArrowRight size={14} /></span></button><button className="journey-step" onClick={() => go('quote')}><span className="step-number">03</span><span className="step-icon"><FileText size={19} /></span><b>Get a clear quote</b><small>We’ll help you decide on the right details.</small><span className="step-link">Ask AG <ArrowRight size={14} /></span></button></div></section>

      <section className="feature-band"><div className="feature-image"><Photo src={localImage('ag-print-production.jpg')} alt="Commercial printing equipment and a range of finished print samples" /></div><div className="feature-copy"><Eyebrow>GOOD WORK, MADE TOGETHER</Eyebrow><h2>From first idea<br />to <em>finished print.</em></h2><p>Every project is a little different. AG helps you find the right format, materials and finish, then turns your brief into something you can hold.</p><button className="button button-outline" onClick={() => go('about')}>Get to know AG <ArrowRight size={16} /></button><div className="feature-foot"><span>01 /</span> A friendly partner from idea to finished print.</div></div></section>

      <section className="section portfolio-home">
        <SectionHead eyebrow="A LITTLE INSPIRATION" title={<>Made to be seen.<br /><em>Made to be kept.</em></>} text="A few imagined projects from the AG print room. Use them to spark an idea of your own." link="Browse the gallery" action={() => go('portfolio')} />
        <div className="home-project-grid">{PROJECTS.slice(0, 3).map((p, i) => <button className={'home-project project-' + i} key={p.title} onClick={() => openProject(p)}><Photo src={p.image} alt={p.alt} /><span className="project-meta"><small>{p.category} · {p.client}</small><b>{p.title}</b><ArrowUpRight size={17} /></span></button>)}</div>
      </section>
      <section className="quote-banner"><div className="quote-stamp">AG<span>PRINT<br />STUDIO</span></div><div><Eyebrow>LET’S MAKE SOMETHING GOOD</Eyebrow><h2>Have a project<br />in <em>mind?</em></h2><p>Tell us a little about it. We’ll help with the details and put together a quote.</p></div><button className="button button-light" onClick={() => go('quote')}>Request a quote <ArrowRight size={17} /></button><span className="quote-doodle">AG <i>✳</i></span></section>
    </main>
  </>
}

function About({ go }: { go: (path: string) => void }) {
  return <main className="page-main">
    <section className="page-intro about-intro"><div><Eyebrow>ABOUT AG</Eyebrow><h1>Print with a<br /><em>personal touch.</em></h1><p>AG is a print studio for people and businesses with something to share. We bring practical know-how, careful craft and a friendly approach to every project.</p><button className="button button-lime" onClick={() => go('quote')}>Start a conversation <ArrowRight size={16} /></button></div><Photo src={photo('photo-1455390582262-044cdead277a', 1300)} alt="A creative workspace covered with notes and paper" className="about-cover" /></section>
    <div className="about-stats"><div><b>Made for you</b><span>Not a one-size-fits-all print run</span></div><div><b>Small or large</b><span>We’ll help find the right quantity</span></div><div><b>Human advice</b><span>Talk through paper, finish and timing</span></div></div>
    <section className="about-story"><Eyebrow>THE AG APPROACH</Eyebrow><div><h2>Thoughtful from<br /><em>first idea to final fold.</em></h2><div><p>Print is personal. It is the invitation people take home, the shirt your team wears, the banner that gives an event its welcome. We want each piece to feel considered and made for its purpose.</p><p>So we keep the process clear: share the idea, explore the options with us, and get a quote before the work begins. Bring finished artwork or let us help you find a starting point.</p><button className="text-link" onClick={() => go('services')}>See what we can print <ArrowRight size={16} /></button></div></div></section>
    <div className="about-photo-row"><Photo src={photo('photo-1577083552431-6e5fd01aa342', 1000)} alt="A colourful finished art print" /><Photo src={photo('photo-1544947950-fa07a98d237f', 900)} alt="Carefully printed books" /><Photo src={photo('photo-1514228742587-6b1558fcca3d', 900)} alt="A handmade ceramic mug" /></div>
    <section className="about-cta"><div><Eyebrow>WE’D LOVE TO HEAR ABOUT IT</Eyebrow><h2>Bring us your<br /><em>next good idea.</em></h2></div><button className="button button-dark" onClick={() => go('contact')}>Contact AG <ArrowRight size={16} /></button></section>
  </main>
}

function ServicesPage({ services, go }: { services: Service[]; go: (path: string) => void }) {
  const [category, setCategory] = useState('All services')
  const categories = ['All services', 'Commercial print', 'Large format', 'Business print', 'Marketing print', 'Apparel & textile', 'Packaging & labels', 'Design & finishing', 'Events & books', 'Custom print', 'Signs & branding', 'Document services']
  const shown = category === 'All services' ? services : services.filter(s => s.category === category)
  return <main className="page-main">
    <section className="page-title"><Eyebrow>THE AG PRINT MENU</Eyebrow><h1>What can we<br /><em>make for you?</em></h1><p>Explore the print services below. Every job is a little different, so ask us for the right finish and a quote made for your project.</p></section>
    <div className="filter-chips">{categories.map(c => <button className={category === c ? 'filter-chip selected' : 'filter-chip'} key={c} onClick={() => setCategory(c)}>{c}<span>{c === 'All services' ? services.length : services.filter(s => s.category === c).length}</span></button>)}</div>
    <div className="service-gallery">{shown.map((s, i) => <button className="service-gallery-card" key={s.slug} onClick={() => go('service/' + s.slug)}><Photo src={s.image} alt={s.alt} className={'gallery-img gallery-img-' + (i % 4)} /><span className="gallery-card-icon"><Icon name={s.icon} size={18} /></span><div className="gallery-card-info"><span>{s.category}</span><h2>{s.title}</h2><p>{s.short}</p><b>Explore service <ArrowRight size={14} /></b></div></button>)}</div>
    <section className="service-help"><div className="help-mark"><MessageCircle size={23} /></div><div><Eyebrow>NOT SURE WHAT YOU NEED?</Eyebrow><h2>Tell us the idea. We’ll help shape the print.</h2><p>Share your project and our team can suggest materials, quantities and finishes to fit.</p></div><button className="button button-outline" onClick={() => go('quote')}>Ask AG for a quote <ArrowRight size={16} /></button></section>
  </main>
}

function ServiceDetail({ service, services, go }: { service?: Service; services: Service[]; go: (path: string) => void }) {
  const s = service || services[0]
  if (!s) return <main className="page-main"><h1>This service is currently unavailable.</h1><button className="button button-lime" onClick={() => go('services')}>View services</button></main>
  const related = services.filter(item => item.slug !== s.slug).slice(0, 3)
  return <main className="page-main">
    <div className="breadcrumbs"><button onClick={() => go('services')}>Services</button><ChevronRight size={14} /><span>{s.title}</span></div>
    <section className="service-detail-hero"><div className="detail-copy"><Eyebrow>{s.category}</Eyebrow><h1>{s.title},<br /><em>made your way.</em></h1><p>{s.detail}</p><div className="detail-points"><span><Clock3 size={17} /><b>Typical timing</b><small>{s.turnaround}</small></span><span><BadgeCheck size={17} /><b>Made for your project</b><small>Sizes and finishes to discuss</small></span></div><button className="button button-lime" onClick={() => go('quote/' + s.slug)}>Ask for a quote <ArrowRight size={16} /></button></div><div className="detail-photo-wrap"><Photo src={s.image} alt={s.alt} className="detail-photo" /><span className="detail-photo-note"><Icon name={s.icon} size={17} /> {s.title.toUpperCase()}</span><span className="detail-photo-number">AG / 0{s.slug.length % 8 + 1}</span></div></section>
    <section className="detail-process"><Eyebrow>A SIMPLE PLACE TO START</Eyebrow><div><div><span>01</span><h3>Tell us the plan</h3><p>What it is, roughly how many you need, and when you need it.</p></div><div><span>02</span><h3>We’ll talk options</h3><p>Our team can guide you on materials, print method and finish.</p></div><div><span>03</span><h3>Get your quote</h3><p>We’ll come back with a clear quote and the next steps.</p></div></div></section>
    {related.length > 0 && <section className="related-services"><div className="section-head"><div><Eyebrow>MORE FROM AG</Eyebrow><h2>More ways to<br /><em>make a mark.</em></h2></div><button className="text-link" onClick={() => go('services')}>All services <ArrowRight size={16} /></button></div><div className="related-row">{related.map(r => <button key={r.slug} onClick={() => go('service/' + r.slug)}><Photo src={r.image} alt={r.alt} /><span><small>{r.category}</small><b>{r.title}</b></span><ArrowUpRight size={17} /></button>)}</div></section>}
  </main>
}

function Portfolio({ go, openProject }: { go: (path: string) => void; openProject: (p: Project) => void }) {
  const [filter, setFilter] = useState('All work')
  const filters = ['All work', 'Flyers', 'T-shirts', 'Banners', 'Mugs', 'Books', 'Packaging', 'Art prints', 'Business print', 'Invitations', 'Stickers', 'Signage', 'Vehicle branding']
  const shown = filter === 'All work' ? PROJECTS : PROJECTS.filter(p => p.category === filter)
  return <main className="page-main">
    <section className="page-title portfolio-title"><Eyebrow>PRINT IN THE WILD</Eyebrow><h1>A few things<br /><em>we’ve made.</em></h1><p>A sample gallery for the AG print studio. Tap a project to see more and start a conversation about your own.</p></section>
    <div className="filter-chips">{filters.map(c => <button className={filter === c ? 'filter-chip selected' : 'filter-chip'} key={c} onClick={() => setFilter(c)}>{c}<span>{c === 'All work' ? PROJECTS.length : PROJECTS.filter(p => p.category === c).length}</span></button>)}</div>
    <div className="portfolio-grid">{shown.map((p, i) => <button className={'portfolio-card portfolio-card-' + (i % 3)} key={p.title} onClick={() => openProject(p)}><Photo src={p.image} alt={p.alt} /><span className="portfolio-card-meta"><small>{p.category} <i /> {p.client}</small><b>{p.title}</b><ArrowUpRight size={18} /></span></button>)}</div>
    <div className="portfolio-bottom"><span>HAVE AN IDEA OF YOUR OWN?</span><button className="button button-dark" onClick={() => go('quote')}>Tell us about it <ArrowRight size={16} /></button></div>
  </main>
}

function QuoteForm({ services, initialService, submit }: { services: Service[]; initialService: string; submit: (q: Omit<Quote, 'id' | 'status' | 'received'>) => string }) {
  const [done, setDone] = useState('')
  const [files, setFiles] = useState<string[]>([])
  const selected = services.find(s => s.slug === initialService)?.title || ''
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const id = submit({
      name: String(data.get('name') || ''),
      email: String(data.get('email') || ''),
      company: String(data.get('company') || ''),
      service: String(data.get('service') || 'Other / not sure'),
      details: String(data.get('details') || ''),
      files,
    })
    setDone(id)
  }
  return <main className="quote-page">
    <section className="quote-intro"><Eyebrow>A PERSON AT AG WILL READ THIS</Eyebrow><h1>Let’s get your<br /><em>idea in motion.</em></h1><p>Tell us about the print you need and we’ll get back with helpful next steps and a tailored quote.</p><div className="quote-contact"><span><Clock3 size={17} /></span><div><small>Typical reply time</small><b>Within 1–2 working days</b></div></div><div className="quote-contact"><span><Mail size={17} /></span><div><small>Prefer email?</small><a href="mailto:hello@ag.example">hello@ag.example</a></div></div><div className="local-note"><Sparkles size={16} /> This preview does not send email or save your enquiry.</div></section>
    <section className="quote-form-card">{done ? <div className="quote-success"><span><Check size={28} /></span><Eyebrow>PROJECT NOTE CREATED</Eyebrow><h2>Thanks for<br /><em>sharing the idea.</em></h2><p>Your demo reference is <b>{done}</b>. The enquiry is visible in the admin preview during this browser session. Nothing has been sent or saved.</p><button className="button button-dark" onClick={() => { setDone(''); setFiles([]) }}>Send another request <ArrowRight size={16} /></button></div> :
      <form className="quote-form" onSubmit={onSubmit}>
        <div className="form-heading"><span>01 / YOUR PROJECT</span><small>* required</small></div>
        <label className="field">What are you looking to print? <i>*</i><select name="service" required defaultValue={selected}><option value="" disabled>Select a service</option>{services.map(s => <option key={s.slug}>{s.title}</option>)}<option>Other / not sure</option></select></label>
        <label className="field">A few project details <i>*</i><textarea name="details" required rows={5} placeholder="What are you making, roughly how many do you need, and when do you need them?" /></label>
        <div className="form-two"><label className="field">Your name <i>*</i><input name="name" required placeholder="Your name" /></label><label className="field">Email address <i>*</i><input type="email" name="email" required placeholder="you@example.com" /></label></div>
        <label className="field">Business or organisation <small>OPTIONAL</small><input name="company" placeholder="The name on the door" /></label>
        <div className="field upload-field"><span>Artwork or references <small>OPTIONAL</small></span><label className="upload-box"><input type="file" multiple accept=".pdf,.ai,.psd,.png,.jpg,.jpeg" onChange={e => setFiles(e.currentTarget.files ? Array.from(e.currentTarget.files).map(file => file.name) : [])} /><span className="upload-icon"><Upload size={19} /></span><span><b>{files.length ? files.join(', ') : 'Choose files to attach'}</b><small>{files.length ? files.length + ' file(s) selected for this preview' : 'PDF, AI, PSD, PNG or JPG · sample selection only'}</small></span><span className="browse-link">Browse</span></label><small>No artwork yet? A description is a great place to start.</small></div>
        <button className="button button-lime submit-quote">Send my quote request <ArrowRight size={17} /></button><small className="privacy-note">Prototype only · Nothing is sent or stored outside this page.</small>
      </form>}
    </section>
  </main>
}

function Contact({ go }: { go: (path: string) => void }) {
  return <main className="page-main">
    <section className="page-title contact-title"><Eyebrow>WE’RE ALL EARS</Eyebrow><h1>Let’s talk<br /><em>about your print.</em></h1><p>Questions, ideas or an early sketch? Reach out and a member of the AG team can point you in the right direction.</p></section>
    <div className="contact-layout"><div className="contact-info"><div><span><Mail size={19} /></span><small>EMAIL THE STUDIO</small><a href="mailto:hello@ag.example">hello@ag.example</a></div><div><span><Phone size={19} /></span><small>GIVE US A CALL</small><a href="tel:+0000000000">Add AG phone number</a></div><div><span><MapPin size={19} /></span><small>COME BY</small><b>Studio address placeholder</b><small>Replace with AG’s location</small></div><button className="button button-lime" onClick={() => go('quote')}>Request a quote <ArrowRight size={16} /></button></div><div className="faq-panel"><Eyebrow>GOOD QUESTIONS</Eyebrow><h2>Quick answers<br /><em>to get you started.</em></h2>{FAQ.map((row, i) => <details key={row[0]} open={i === 0}><summary>{row[0]}<span><Plus size={16} /></span></summary><p>{row[1]}</p></details>)}</div></div>
    <section className="contact-image"><Photo src={photo('photo-1455390582262-044cdead277a', 1500)} alt="A welcoming creative studio with sketches and paper" /><div><span>GOOD PRINT STARTS WITH A CONVERSATION.</span><h2>Come as you are.<br />Bring the <em>idea.</em></h2></div></section>
  </main>
}

function ProjectLightbox({ project, close, go }: { project: Project | null; close: () => void; go: (path: string) => void }) {
  useEffect(() => {
    if (!project) return
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    window.addEventListener('keydown', key)
    return () => window.removeEventListener('keydown', key)
  }, [project, close])
  if (!project) return null
  return <div className="lightbox-backdrop" onClick={close}><div className="lightbox" role="dialog" aria-modal="true" aria-label={project.title} onClick={e => e.stopPropagation()}><button className="lightbox-close" onClick={close} aria-label="Close project"><X size={21} /></button><Photo src={project.image} alt={project.alt} className="lightbox-image" /><div className="lightbox-copy"><Eyebrow>{project.category} · {project.client}</Eyebrow><h2>{project.title}</h2><p>{project.note}</p><button className="button button-lime" onClick={() => { close(); go('quote') }}>Ask about a project like this <ArrowRight size={16} /></button></div></div></div>
}

function Admin({ tab, setTab, go, services, toggleService, quotes, updateQuote }: {
  tab: AdminTab; setTab: (tab: AdminTab) => void; go: (path: string) => void; services: Service[];
  toggleService: (slug: string) => void; quotes: Quote[]; updateQuote: (id: string, status: string) => void
}) {
  const [collapsed, setCollapsed] = useState(false)
  const [search, setSearch] = useState('')
  const nav: { id: AdminTab; label: string; icon: typeof LayoutDashboard }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard }, { id: 'services', label: 'Services', icon: Printer },
    { id: 'quotations', label: 'Quotations', icon: FileText }, { id: 'portfolio', label: 'Portfolio', icon: ImageIcon },
  ]
  const activeQuotes = quotes.filter(q => q.status !== 'Completed').length
  const filtered = quotes.filter(q => (q.id + q.name + q.company + q.service + q.details + q.status).toLowerCase().includes(search.toLowerCase()))
  const title = nav.find(item => item.id === tab)?.label || 'Overview'
  return <main className={collapsed ? 'admin-shell admin-collapsed' : 'admin-shell'}>
    <aside className="admin-sidebar"><div className="admin-sidebar-top"><Brand go={() => go('home')} /><button onClick={() => setCollapsed(!collapsed)} aria-label="Toggle sidebar"><Menu size={17} /></button></div><div className="admin-preview-tag"><i /> LOCAL PREVIEW</div><span className="admin-nav-label">WORKSPACE</span><nav>{nav.map(item => { const I = item.icon; return <button className={tab === item.id ? 'active' : ''} key={item.id} onClick={() => setTab(item.id)}><I size={18} /><span>{item.label}</span>{item.id === 'quotations' && <i className="nav-count">{activeQuotes}</i>}</button> })}</nav><div className="admin-side-bottom"><span className="admin-person">AG</span><div><b>AG Print Studio</b><small>Local admin preview</small></div></div></aside>
    <div className="admin-content-wrap"><header className="admin-top"><div><button className="admin-menu" onClick={() => setCollapsed(!collapsed)}><Menu size={17} /></button><span>Workspace</span><ChevronRight size={14} /><b>{title}</b><i>PREVIEW</i></div><button className="button button-lime button-small" onClick={() => go('quote')}>View quote form <ArrowUpRight size={14} /></button></header>
      <section className="admin-content">
        {tab === 'overview' && <>
          <div className="admin-page-heading"><div><Eyebrow>GOOD MORNING, AG</Eyebrow><h1>Enquiries at a glance.</h1><p>A sample view of service enquiries in this frontend preview.</p></div><span className="admin-date"><Clock3 size={15} /> Last 30 days</span></div>
          <div className="admin-metrics"><div><span><FileText /></span><small>OPEN QUOTATIONS</small><b>{activeQuotes}</b><i>Sample enquiries</i></div><div><span><Printer /></span><small>ACTIVE SERVICES</small><b>{services.length}</b><i>Visible on the site</i></div><div><span><Users /></span><small>UNIQUE ENQUIRERS</small><b>{new Set(quotes.map(q => q.email)).size}</b><i>Sample contacts</i></div></div>
          <div className="admin-two-panels"><section className="admin-panel"><div className="admin-panel-head"><div><h2>Latest enquiries</h2><p>Follow up with the people behind the projects.</p></div><button className="text-link" onClick={() => setTab('quotations')}>View all <ArrowRight size={14} /></button></div><div className="admin-quote-list">{quotes.slice(0, 4).map(q => <div key={q.id}><span className="quote-avatar">{q.name.slice(0, 1).toUpperCase()}</span><div><b>{q.name}</b><small>{q.service} · {q.received}</small></div><span className={'status-badge ' + (q.status === 'Needs review' ? 'needs-review' : '')}>{q.status}</span></div>)}</div></section><section className="admin-panel admin-tips"><span className="tip-icon"><Sparkles size={20} /></span><Eyebrow>THE AG WAY</Eyebrow><h2>Every quote starts<br />with a conversation.</h2><p>Share project details, discuss the options, then send a clear quote from the team.</p><button className="text-link" onClick={() => setTab('services')}>Manage visible services <ArrowRight size={14} /></button></section></div>
        </>}
        {tab === 'services' && <><div className="admin-page-heading"><div><Eyebrow>THE AG PRINT MENU</Eyebrow><h1>Services on the site.</h1><p>Show or hide sample services in the customer-facing catalogue.</p></div></div><div className="admin-service-list">{services.map(s => <div key={s.slug}><Photo src={s.image} alt={s.alt} /><span className="admin-service-icon"><Icon name={s.icon} size={17} /></span><div><small>{s.category}</small><b>{s.title}</b><p>{s.short}</p></div><button className={s.visible ? 'service-toggle is-on' : 'service-toggle'} onClick={() => toggleService(s.slug)}><i />{s.visible ? 'Visible' : 'Hidden'}</button></div>)}</div></>}
        {tab === 'quotations' && <><div className="admin-page-heading"><div><Eyebrow>INQUIRY FOLLOW-UP</Eyebrow><h1>Quotations.</h1><p>Review incoming requests and update their demo status.</p></div><label className="admin-search"><Search size={16} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search enquiries" /></label></div><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>REFERENCE</th><th>CONTACT</th><th>PROJECT</th><th>RECEIVED</th><th>STATUS</th></tr></thead><tbody>{filtered.map(q => <tr key={q.id}><td><b className="mono">{q.id}</b></td><td><b>{q.name}</b><small>{q.email}</small></td><td><b>{q.service}</b><small>{q.details}</small>{q.files.length > 0 && <small className="file-note"><Upload size={12} /> {q.files.join(', ')}</small>}</td><td>{q.received}</td><td><select className="quote-status-select" value={q.status} onChange={e => updateQuote(q.id, e.target.value)}><option>Needs review</option><option>In progress</option><option>Quote sent</option><option>Completed</option></select></td></tr>)}</tbody></table>{filtered.length === 0 && <p className="empty-search">No enquiries match that search.</p>}<div className="admin-table-foot"><span>{quotes.length} sample enquiry records</span><small>Changes remain in this browser session only.</small></div></div></>}
        {tab === 'portfolio' && <><div className="admin-page-heading"><div><Eyebrow>GALLERY PREVIEW</Eyebrow><h1>Work on display.</h1><p>Sample projects used in the gallery and homepage.</p></div><button className="button button-outline button-small" onClick={() => go('portfolio')}>Open public gallery <ArrowUpRight size={14} /></button></div><div className="admin-project-grid">{PROJECTS.map(p => <div key={p.title}><Photo src={p.image} alt={p.alt} /><small>{p.category} · {p.client}</small><b>{p.title}</b></div>)}</div></>}
      </section>
      <footer className="admin-footer"><span>AG workspace · frontend prototype</span><span>Sample data only <i /> No changes are saved</span></footer>
    </div>
    <div className="admin-watermark"><Eye size={14} /> ADMIN PREVIEW · LOCAL STATE</div>
  </main>
}

export default function App() {
  const [path, setPath] = useState(decodeURIComponent(location.hash.replace(/^#\/?/, '')) || 'home')
  const [message, setMessage] = useState('')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [services, setServices] = useState(SERVICES.map(service => ({ ...service, visible: true })))
  const [quotes, setQuotes] = useState(DEMO_QUOTES)
  const [adminTab, setAdminTab] = useState<AdminTab>('overview')
  useEffect(() => {
    const onHash = () => setPath(decodeURIComponent(location.hash.replace(/^#\/?/, '')) || 'home')
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, [path])
  useEffect(() => {
    if (path.startsWith('admin/')) {
      const next = path.split('/')[1] as AdminTab
      if (['overview', 'services', 'quotations', 'portfolio'].includes(next)) setAdminTab(next)
    }
  }, [path])
  const go = (next: string) => { window.location.hash = '/' + next; setPath(next) }
  const toast = (text: string) => { setMessage(text); window.setTimeout(() => setMessage(''), 3000) }
  const visibleServices = useMemo(() => services.filter(s => s.visible), [services])
  const isAdmin = path === 'admin' || path.startsWith('admin/')
  const makeQuote = (q: Omit<Quote, 'id' | 'status' | 'received'>) => {
    const id = 'AG-Q-' + (1050 + quotes.length)
    setQuotes(current => [{ ...q, id, status: 'Needs review', received: 'Just now' }, ...current])
    toast('Demo enquiry ' + id + ' added to the admin preview.')
    return id
  }
  const toggleService = (slug: string) => setServices(current => current.map(s => s.slug === slug ? { ...s, visible: !s.visible } : s))
  const updateQuote = (id: string, status: string) => {
    setQuotes(current => current.map(q => q.id === id ? { ...q, status } : q))
    toast('Enquiry status changed in this preview.')
  }
  const currentService = path.startsWith('service/') ? services.find(s => s.slug === path.split('/')[1]) : undefined
  let page: ReactNode
  if (path === 'about') page = <About go={go} />
  else if (path === 'services') page = <ServicesPage services={visibleServices} go={go} />
  else if (path.startsWith('service/')) page = <ServiceDetail service={currentService} services={visibleServices} go={go} />
  else if (path === 'portfolio') page = <Portfolio go={go} openProject={setSelectedProject} />
  else if (path === 'quote' || path.startsWith('quote/')) page = <QuoteForm services={visibleServices} initialService={path.split('/')[1] || ''} submit={makeQuote} />
  else if (path === 'contact') page = <Contact go={go} />
  else if (isAdmin) page = <Admin tab={adminTab} setTab={tab => { setAdminTab(tab); go('admin/' + tab) }} go={go} services={services} toggleService={toggleService} quotes={quotes} updateQuote={updateQuote} />
  else page = <Home go={go} services={visibleServices} openProject={setSelectedProject} />
  return <div className={isAdmin ? 'app app-admin' : 'app'}>
    {!isAdmin && <><DemoNote /><Header go={go} /></>}
    {page}
    {!isAdmin && <Footer go={go} />}
    <ProjectLightbox project={selectedProject} close={() => setSelectedProject(null)} go={go} />
    {message && <div className="toast-message"><CheckCircle2 size={17} />{message}</div>}
  </div>
}

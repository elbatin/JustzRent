import Link from "next/link"
import { Car, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-card border-t border-border/50 mt-auto">
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 font-bold text-xl mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
                <Car className="h-5 w-5 text-primary-foreground" />
              </div>
              <span>
                Justz<span className="text-primary">Rent</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Premium car rental service offering a wide range of vehicles for every occasion. Drive in comfort and style.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/fleet" className="hover:text-primary transition-colors">Our Fleet</Link></li>
              <li><Link href="/fleet?category=economy" className="hover:text-primary transition-colors">Economy Cars</Link></li>
              <li><Link href="/fleet?category=suv" className="hover:text-primary transition-colors">SUVs</Link></li>
              <li><Link href="/fleet?category=luxury" className="hover:text-primary transition-colors">Luxury Cars</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                <span>+90 555 123 4567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                <span>info@justzrent.com</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                <span>Istanbul, Turkey</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} JustzRent. All rights reserved.</span>
          <a
            href="https://elbatin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-1.5 hover:text-primary transition-colors"
          >
            <span>Designed &amp; built by</span>
            <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
              Batın
            </span>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity text-primary">↗</span>
          </a>
        </div>
      </div>
    </footer>
  )
}
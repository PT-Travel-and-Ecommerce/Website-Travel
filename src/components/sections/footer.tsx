import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Twitter, Youtube, Instagram } from 'lucide-react';

const GolobeLogo = () => (
  <Link href="/" aria-label="Golobe logo. Click to go to home page">
    <div className="flex items-center">
      <Image src="/logo.png" alt="Golobe" width={140} height={36} className="h-44 w-auto" />
    </div>
  </Link>
);


const Footer = () => {
  return (
    <footer className="bg-primary px-4 py-10 text-white md:px-20 md:py-10">
      <div className="grid grid-cols-2 gap-8 md:grid-cols-5 md:gap-4">
        <div className="col-span-2 flex flex-col gap-4 md:col-span-1">
          <GolobeLogo />
          <div className="flex gap-4">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <Facebook className="h-6 w-6 text-white transition-opacity hover:opacity-80" />
            </a>
            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <Twitter className="h-6 w-6 text-white transition-opacity hover:opacity-80" />
            </a>
            <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" aria-label="Youtube">
              <Youtube className="h-6 w-6 text-white transition-opacity hover:opacity-80" />
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <Instagram className="h-6 w-6 text-white transition-opacity hover:opacity-80" />
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-4 text-sm">
          <h3 className="font-bold">Our Destination</h3>
          <Link href="#" className="hover:underline">Canada</Link>
          <Link href="#" className="hover:underline">Alaska</Link>
          <Link href="#" className="hover:underline">France</Link>
          <Link href="#" className="hover:underline">Iceland</Link>
        </div>

        <div className="flex flex-col gap-4 text-sm">
          <h3 className="font-bold">Our Activity</h3>
          <Link href="#" className="hover:underline">Northern Lights</Link>
          <Link href="#" className="hover:underline">Cruising & Sailing</Link>
          <Link href="#" className="hover:underline">Multi-activities</Link>
          <Link href="#" className="hover:underline">Kayaking</Link>
        </div>

        <div className="flex flex-col gap-4 text-sm">
          <h3 className="font-bold">Travel Blogs</h3>
          <Link href="#" className="hover:underline">Bali Travel Guide</Link>
          <Link href="#" className="hover:underline">Srilanka Travel Guide</Link>
          <Link href="#" className="hover:underline">Peru Travel Guide</Link>
        </div>

        <div className="flex flex-col gap-8 text-sm">
          <div className="flex flex-col gap-4">
            <h3 className="font-bold">About Us</h3>
            <Link href="#" className="hover:underline">Our Story</Link>
            <Link href="#" className="hover:underline">Work with Us</Link>
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="font-bold">Contact</h3>
            <Link href="/support" className="hover:underline">Support Center</Link>
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
            <Link href="/terms" className="hover:underline">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
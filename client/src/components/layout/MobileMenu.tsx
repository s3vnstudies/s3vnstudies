import { Link, useLocation } from "wouter";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: { label: string; path: string }[];
}

const MobileMenu = ({ isOpen, onClose, navLinks }: MobileMenuProps) => {
  const [location] = useLocation();

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-[300px] sm:w-[380px]">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="py-4">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={onClose}
                className={`px-3 py-2 rounded-md font-medium ${
                  location === link.path
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#0a0a0a] px-4 py-5 text-center sm:px-8 sm:py-6">
      <p className="text-[7px] font-bold uppercase tracking-[0.25em] text-white/20 sm:text-[9px]">
        &copy; {new Date().getFullYear()}&nbsp; Solstice Chess &nbsp;&mdash;&nbsp; June Solstice Game Jam
      </p>
    </footer>
  );
}

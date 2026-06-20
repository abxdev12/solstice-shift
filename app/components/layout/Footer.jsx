export default function Footer() {
  return (
    <footer className="border-t border-black/10 bg-white px-4 py-5 text-center sm:px-8 sm:py-6">
      <p className="text-[7px] font-bold uppercase tracking-[0.25em] text-neutral-400 sm:text-[9px] sm:tracking-[0.2em]">
        &copy; {new Date().getFullYear()}&nbsp; Solstice Chess &nbsp;&mdash;&nbsp; June Solstice Game Jam
      </p>
    </footer>
  );
}

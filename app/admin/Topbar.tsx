const Topbar = () => (
  <header className="flex items-center justify-between px-8 py-3 bg-white border-b shadow-sm">
    <input
      type="search"
      className="rounded-lg border px-3 py-2 mr-3 w-72"
      placeholder="Search"
    />
    <div className="flex items-center gap-4">
      <button className="bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700 transition">Create</button>
      {/* Add notification & help icons */}
    </div>
  </header>
);

export default Topbar;

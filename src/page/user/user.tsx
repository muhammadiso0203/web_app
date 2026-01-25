const User = () => {
  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-sm text-slate-500">Users</p>
          <h2 className="text-3xl font-semibold text-slate-800 mt-2">
            1,245
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-sm text-slate-500">Orders</p>
          <h2 className="text-3xl font-semibold text-slate-800 mt-2">
            320
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-sm text-slate-500">Revenue</p>
          <h2 className="text-3xl font-semibold text-slate-800 mt-2">
            $12,400
          </h2>
        </div>
      </div>

      <div className="mt-10">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition">
          Add New
        </button>
      </div>
    </div>
  );
}


export default User;
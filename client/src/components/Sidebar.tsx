const Sidebar = () => {
    return (
        <aside className="sticky top-0 h-full">
            <div className="flex items-end">
                <button className="bg-orange-500 hover:bg-orange-600 transitionItem">Logout</button>
            </div>
        </aside>
    );
}

export default Sidebar;
import { useQuery } from '@tanstack/react-query';
import { categoryService, type Category } from '../../services/category.service';

export default function CategorySettings() {
    const { data: categories = [] } = useQuery({
        queryKey: ['categories'],
        queryFn: categoryService.getCategories
    });

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#1e293b] dark:text-white">Categories</h2>
                <button className="px-4 py-2 bg-primary text-white rounded-lg font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary-dark transition-colors">
                    + Add Category
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(categories as Category[]).map((cat: Category) => (
                    <div key={cat.id} className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl flex items-center justify-between group hover:bg-white dark:hover:bg-white/10 hover:shadow-md transition-all border border-transparent hover:border-gray-100">
                        <div className="flex items-center gap-3">
                            <div
                                className="size-10 rounded-lg flex items-center justify-center text-white"
                                style={{ backgroundColor: cat.color }}
                            >
                                <span className="material-symbols-outlined text-[20px]">{cat.icon}</span>
                            </div>
                            <div>
                                <p className="font-bold text-[#1e293b] dark:text-white">{cat.name}</p>
                                <p className="text-xs text-gray-500 capitalize">{cat.type}</p>
                            </div>
                        </div>
                        <button className="p-2 text-gray-400 hover:text-primary opacity-0 group-hover:opacity-100 transition-all">
                            <span className="material-symbols-outlined">edit</span>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

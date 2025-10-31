import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Edit,
    Trash2,
    BookOpen,
    Tag,
    Save,
    X,
    AlertCircle,
    CheckCircle,
    Eye,
    TrendingUp
} from 'lucide-react';
import { adminApi, Category } from '@/services/api/adminApi';
import { toast } from 'sonner';

interface CategoryManagementProps {
    darkMode: boolean;
    dashboardData: any;
}

const CategoryManagement: React.FC<CategoryManagementProps> = ({ darkMode, dashboardData }) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        slug: ''
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setIsLoading(true);
            console.log('Fetching categories...');
            const result = await adminApi.categories.getAll();
            console.log('Categories result:', result);
            setCategories(result);
        } catch (error) {
            console.error('Error fetching categories:', error);
            toast.error('Failed to load categories');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            const newCategory = await adminApi.categories.create({
                name: formData.name,
                description: formData.description,
                slug: formData.slug || undefined
            });

            setCategories(prev => [...prev, newCategory]);
            setShowAddModal(false);
            setFormData({ name: '', description: '', slug: '' });
            toast.success('Category created successfully');
        } catch (error: any) {
            console.error('Error creating category:', error);
            toast.error(error.response?.data?.message || 'Failed to create category');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCategory) return;

        try {
            setIsSubmitting(true);
            const updatedCategory = await adminApi.categories.update(selectedCategory.id, {
                name: formData.name,
                description: formData.description,
                slug: formData.slug || undefined
            });

            setCategories(prev => prev.map(cat =>
                cat.id === selectedCategory.id ? updatedCategory : cat
            ));
            setShowEditModal(false);
            setSelectedCategory(null);
            setFormData({ name: '', description: '', slug: '' });
            toast.success('Category updated successfully');
        } catch (error: any) {
            console.error('Error updating category:', error);
            toast.error(error.response?.data?.message || 'Failed to update category');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteCategory = async () => {
        if (!selectedCategory) return;

        try {
            setIsSubmitting(true);
            await adminApi.categories.delete(selectedCategory.id);

            setCategories(prev => prev.filter(cat => cat.id !== selectedCategory.id));
            setShowDeleteModal(false);
            setSelectedCategory(null);
            toast.success('Category deleted successfully');
        } catch (error: any) {
            console.error('Error deleting category:', error);
            toast.error(error.response?.data?.message || 'Failed to delete category');
        } finally {
            setIsSubmitting(false);
        }
    };

    const openEditModal = (category: Category) => {
        setSelectedCategory(category);
        setFormData({
            name: category.name,
            description: category.description || '',
            slug: category.slug
        });
        setShowEditModal(true);
    };

    const openDeleteModal = (category: Category) => {
        setSelectedCategory(category);
        setShowDeleteModal(true);
    };

    const generateSlug = (name: string) => {
        return name.toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
    };

    const handleNameChange = (name: string) => {
        setFormData(prev => ({
            ...prev,
            name,
            slug: prev.slug || generateSlug(name)
        }));
    };

    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalCourses = categories.reduce((sum, cat) => sum + (cat.courses_count || 0), 0);

    if (isLoading) {
        return (
            <div className= "flex items-center justify-center py-12" >
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" > </div>
                </div>
        );
    }

return (
    <div className= "space-y-6" >
    {/* Header */ }
    < div className = "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" >
        <div>
        <h2 className={ `text-3xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'}` }>
            Categories Management
                </h2>
                < p className = {`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Manage course categories and organize your content
                        </p>
                        </div>
                        < button
onClick = {() => {
    setFormData({ name: '', description: '', slug: '' });
    setShowAddModal(true);
}}
className = "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
    >
    <Plus className="w-4 h-4" />
        Add Category
            </button>
            </div>

{/* Stats Cards */ }
<div className="grid grid-cols-1 md:grid-cols-3 gap-6" >
    <div className={ `${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-md` }>
        <div className="flex items-center justify-between" >
            <div>
            <p className={ `text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}` }>
                Total Categories
                    </p>
                    < p className = {`text-3xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                        { categories.length }
                        </p>
                        </div>
                        < Tag className = "w-8 h-8 text-blue-600" />
                            </div>
                            </div>

                            < div className = {`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-md`}>
                                <div className="flex items-center justify-between" >
                                    <div>
                                    <p className={ `text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}` }>
                                        Total Courses
                                            </p>
                                            < p className = {`text-3xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                                                { totalCourses }
                                                </p>
                                                </div>
                                                < BookOpen className = "w-8 h-8 text-green-600" />
                                                    </div>
                                                    </div>

                                                    < div className = {`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-md`}>
                                                        <div className="flex items-center justify-between" >
                                                            <div>
                                                            <p className={ `text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}` }>
                                                                Avg Courses / Category
                                                                    </p>
                                                                    < p className = {`text-3xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                                                                        { categories.length > 0 ? Math.round(totalCourses / categories.length) : 0 }
                                                                        </p>
                                                                        </div>
                                                                        < TrendingUp className = "w-8 h-8 text-purple-600" />
                                                                            </div>
                                                                            </div>
                                                                            </div>

{/* Search */ }
<div className={ `${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-md` }>
    <div className="relative" >
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
                        type="text"
placeholder = "Search categories..."
value = { searchTerm }
onChange = {(e) => setSearchTerm(e.target.value)}
className = {`w-full pl-10 pr-4 py-2 border rounded-lg ${darkMode
        ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400'
        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    />
    </div>
    </div>

{/* Categories Grid */ }
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" >
{
    filteredCategories.map((category) => (
        <div
                        key= { category.id }
                        className = {`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow`}
    >
    <div className="flex justify-between items-start mb-4" >
        <div className="flex-1" >
            <h3 className={ `text-lg font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'} mb-2` }>
                { category.name }
                </h3>
{
    category.description && (
        <p className={ `text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-3 line-clamp-2` }>
            { category.description }
            </p>
                                )
}
<div className="flex items-center gap-4 text-sm" >
    <span className={ `${darkMode ? 'text-gray-400' : 'text-gray-500'}` }>
        Slug: { category.slug }
</span>
    </div>
    </div>
    < div className = "flex gap-2 ml-4" >
        <button
                                    onClick={ () => openEditModal(category) }
className = "p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors"
title = "Edit Category"
    >
    <Edit className="w-4 h-4" />
        </button>
        < button
onClick = {() => openDeleteModal(category)}
className = "p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
title = "Delete Category"
    >
    <Trash2 className="w-4 h-4" />
        </button>
        </div>
        </div>

        < div className = "flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700" >
            <div className="flex items-center gap-2" >
                <BookOpen className="w-4 h-4 text-gray-400" />
                    <span className={ `text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}` }>
                        { category.courses_count || 0 } courses
                            </span>
                            </div>
                            < span className = {`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                                }`}>
                                    ID: { category.id }
</span>
    </div>
    </div>
                ))}
</div>

{
    filteredCategories.length === 0 && !isLoading && (
        <div className={ `${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-12 text-center shadow-md` }>
            <Tag className={ `w-12 h-12 ${darkMode ? 'text-gray-400' : 'text-gray-300'} mx-auto mb-4` } />
                < p className = {`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'}`
}>
    { searchTerm? 'No categories found': 'No categories available' }
    </p>
    < p className = {`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-400'} mt-2`}>
        { searchTerm? 'Try adjusting your search criteria': 'Create your first category to get started' }
        </p>
        </div>
            )}

{/* Add Category Modal */ }
{
    showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" >
            <div className={ `${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 w-full max-w-md` }>
                <div className="flex justify-between items-center mb-6" >
                    <h3 className={ `text-xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}` }>
                        Add New Category
                            </h3>
                            < button
    onClick = {() => setShowAddModal(false)
}
className = {`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                            >
    <X className="w-5 h-5" />
        </button>
        </div>

        < form onSubmit = { handleAddCategory } className = "space-y-4" >
            <div>
            <label className={ `block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2` }>
                Category Name *
                    </label>
                    < input
type = "text"
required
value = { formData.name }
onChange = {(e) => handleNameChange(e.target.value)}
className = {`w-full px-3 py-2 border rounded-lg ${darkMode
        ? 'bg-gray-700 border-gray-600 text-gray-100'
        : 'bg-white border-gray-300 text-gray-900'
    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
placeholder = "Enter category name"
    />
    </div>

    < div >
    <label className={ `block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2` }>
        Slug
        </label>
        < input
type = "text"
value = { formData.slug }
onChange = {(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
className = {`w-full px-3 py-2 border rounded-lg ${darkMode
        ? 'bg-gray-700 border-gray-600 text-gray-100'
        : 'bg-white border-gray-300 text-gray-900'
    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
placeholder = "auto-generated-from-name"
    />
    <p className={ `text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1` }>
        Leave empty to auto - generate from name
            </p>
            </div>

            < div >
            <label className={ `block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2` }>
                Description
                </label>
                < textarea
value = { formData.description }
onChange = {(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
rows = { 3}
className = {`w-full px-3 py-2 border rounded-lg ${darkMode
        ? 'bg-gray-700 border-gray-600 text-gray-100'
        : 'bg-white border-gray-300 text-gray-900'
    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
placeholder = "Enter category description"
    />
    </div>

    < div className = "flex gap-3 pt-4" >
        <button
                                    type="button"
onClick = {() => setShowAddModal(false)}
className = {`flex-1 px-4 py-2 border rounded-lg ${darkMode
        ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
    } transition-colors`}
                                >
    Cancel
    </button>
    < button
type = "submit"
disabled = { isSubmitting }
className = "flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
    >
    {
        isSubmitting?(
                                        <div className = "animate-spin rounded-full h-4 w-4 border-b-2 border-white" > </div>
        ): (
                <Save className = "w-4 h-4" />
                                    )}
{ isSubmitting ? 'Creating...' : 'Create Category' }
</button>
    </div>
    </form>
    </div>
    </div>
            )}

{/* Edit Category Modal */ }
{
    showEditModal && selectedCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" >
            <div className={ `${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 w-full max-w-md` }>
                <div className="flex justify-between items-center mb-6" >
                    <h3 className={ `text-xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}` }>
                        Edit Category
                            </h3>
                            < button
    onClick = {() => setShowEditModal(false)
}
className = {`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                            >
    <X className="w-5 h-5" />
        </button>
        </div>

        < form onSubmit = { handleEditCategory } className = "space-y-4" >
            <div>
            <label className={ `block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2` }>
                Category Name *
                    </label>
                    < input
type = "text"
required
value = { formData.name }
onChange = {(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
className = {`w-full px-3 py-2 border rounded-lg ${darkMode
        ? 'bg-gray-700 border-gray-600 text-gray-100'
        : 'bg-white border-gray-300 text-gray-900'
    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
placeholder = "Enter category name"
    />
    </div>

    < div >
    <label className={ `block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2` }>
        Slug
        </label>
        < input
type = "text"
value = { formData.slug }
onChange = {(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
className = {`w-full px-3 py-2 border rounded-lg ${darkMode
        ? 'bg-gray-700 border-gray-600 text-gray-100'
        : 'bg-white border-gray-300 text-gray-900'
    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
placeholder = "category-slug"
    />
    </div>

    < div >
    <label className={ `block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2` }>
        Description
        </label>
        < textarea
value = { formData.description }
onChange = {(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
rows = { 3}
className = {`w-full px-3 py-2 border rounded-lg ${darkMode
        ? 'bg-gray-700 border-gray-600 text-gray-100'
        : 'bg-white border-gray-300 text-gray-900'
    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
placeholder = "Enter category description"
    />
    </div>

    < div className = "flex gap-3 pt-4" >
        <button
                                    type="button"
onClick = {() => setShowEditModal(false)}
className = {`flex-1 px-4 py-2 border rounded-lg ${darkMode
        ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
    } transition-colors`}
                                >
    Cancel
    </button>
    < button
type = "submit"
disabled = { isSubmitting }
className = "flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
    >
    {
        isSubmitting?(
                                        <div className = "animate-spin rounded-full h-4 w-4 border-b-2 border-white" > </div>
        ): (
                <Save className = "w-4 h-4" />
                                    )}
{ isSubmitting ? 'Updating...' : 'Update Category' }
</button>
    </div>
    </form>
    </div>
    </div>
            )}

{/* Delete Confirmation Modal */ }
{
    showDeleteModal && selectedCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" >
            <div className={ `${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 w-full max-w-md` }>
                <div className="flex items-center gap-4 mb-6" >
                    <div className="flex-shrink-0 w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center" >
                        <AlertCircle className="w-6 h-6 text-red-600" />
                            </div>
                            < div >
                            <h3 className={ `text-lg font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}` }>
                                Delete Category
                                    </h3>
                                    < p className = {`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`
}>
    This action cannot be undone
        </p>
        </div>
        </div>

        < p className = {`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
            Are you sure you want to delete <span className="font-semibold" > "{selectedCategory.name}" </span>?
{
    selectedCategory.courses_count && selectedCategory.courses_count > 0 && (
        <span className="text-red-600" > This category has { selectedCategory.courses_count } courses associated with it.</span>
    )}
</p>

    < div className = "flex gap-3" >
        <button
                                type="button"
onClick = {() => setShowDeleteModal(false)}
className = {`flex-1 px-4 py-2 border rounded-lg ${darkMode
        ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
    } transition-colors`}
                            >
    Cancel
    </button>
    < button
onClick = { handleDeleteCategory }
disabled = { isSubmitting }
className = "flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
    >
    {
        isSubmitting?(
                                    <div className = "animate-spin rounded-full h-4 w-4 border-b-2 border-white" > </div>
        ): (
                <Trash2 className = "w-4 h-4" />
                                )}
{ isSubmitting ? 'Deleting...' : 'Delete' }
</button>
    </div>
    </div>
    </div>
            )}
</div>
    );
};

export default CategoryManagement;
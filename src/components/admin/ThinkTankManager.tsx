import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus, Pencil, Trash2, Pin, Eye, EyeOff, Brain, BookOpen, FileText, ClipboardList } from 'lucide-react';
import { toast } from 'sonner';

type ThinkTankCategory = 'synth_standards' | 'playbooks' | 'decision_log' | 'templates';

interface ThinkTankEntry {
  id: string;
  title: string;
  slug: string;
  category: ThinkTankCategory;
  tags: string[];
  content: string;
  excerpt: string | null;
  is_featured: boolean;
  is_published: boolean;
  author_id: string | null;
  author_name: string | null;
  version: number;
  created_at: string;
  updated_at: string;
}

const categoryConfig: Record<ThinkTankCategory, { label: string; icon: React.ReactNode }> = {
  synth_standards: { label: 'SYNTH™ Standards', icon: <Brain className="h-4 w-4" /> },
  playbooks: { label: 'Playbooks', icon: <BookOpen className="h-4 w-4" /> },
  decision_log: { label: 'Decision Log', icon: <ClipboardList className="h-4 w-4" /> },
  templates: { label: 'Templates', icon: <FileText className="h-4 w-4" /> },
};

const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

const ThinkTankManager = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<ThinkTankEntry | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    category: 'synth_standards' as ThinkTankCategory,
    tags: '',
    content: '',
    excerpt: '',
    is_featured: false,
    is_published: true,
    author_name: '',
  });

  const { data: entries, isLoading } = useQuery({
    queryKey: ['admin-think-tank-entries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('think_tank_entries')
        .select('*')
        .order('is_featured', { ascending: false })
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      return data as ThinkTankEntry[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { data: session } = await supabase.auth.getSession();
      const slug = generateSlug(data.title);
      
      const { error } = await supabase
        .from('think_tank_entries')
        .insert({
          title: data.title,
          slug,
          category: data.category,
          tags: data.tags.split(',').map(t => t.trim()).filter(Boolean),
          content: data.content,
          excerpt: data.excerpt || null,
          is_featured: data.is_featured,
          is_published: data.is_published,
          author_id: session?.session?.user?.id || null,
          author_name: data.author_name || null,
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-think-tank-entries'] });
      queryClient.invalidateQueries({ queryKey: ['think-tank-entries'] });
      toast.success('Entry created successfully');
      resetForm();
      setIsDialogOpen(false);
    },
    onError: (error) => {
      toast.error('Failed to create entry: ' + error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const { error } = await supabase
        .from('think_tank_entries')
        .update({
          title: data.title,
          slug: generateSlug(data.title),
          category: data.category,
          tags: data.tags.split(',').map(t => t.trim()).filter(Boolean),
          content: data.content,
          excerpt: data.excerpt || null,
          is_featured: data.is_featured,
          is_published: data.is_published,
          author_name: data.author_name || null,
          version: (editingEntry?.version || 0) + 1,
        })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-think-tank-entries'] });
      queryClient.invalidateQueries({ queryKey: ['think-tank-entries'] });
      toast.success('Entry updated successfully');
      resetForm();
      setIsDialogOpen(false);
      setEditingEntry(null);
    },
    onError: (error) => {
      toast.error('Failed to update entry: ' + error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('think_tank_entries')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-think-tank-entries'] });
      queryClient.invalidateQueries({ queryKey: ['think-tank-entries'] });
      toast.success('Entry deleted');
      setDeleteConfirmId(null);
    },
    onError: (error) => {
      toast.error('Failed to delete: ' + error.message);
    },
  });

  const toggleFeatureMutation = useMutation({
    mutationFn: async ({ id, is_featured }: { id: string; is_featured: boolean }) => {
      const { error } = await supabase
        .from('think_tank_entries')
        .update({ is_featured })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-think-tank-entries'] });
      queryClient.invalidateQueries({ queryKey: ['think-tank-entries'] });
    },
  });

  const togglePublishMutation = useMutation({
    mutationFn: async ({ id, is_published }: { id: string; is_published: boolean }) => {
      const { error } = await supabase
        .from('think_tank_entries')
        .update({ is_published })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-think-tank-entries'] });
      queryClient.invalidateQueries({ queryKey: ['think-tank-entries'] });
      toast.success('Publish status updated');
    },
  });

  const resetForm = () => {
    setFormData({
      title: '',
      category: 'synth_standards',
      tags: '',
      content: '',
      excerpt: '',
      is_featured: false,
      is_published: true,
      author_name: '',
    });
    setEditingEntry(null);
  };

  const openEditDialog = (entry: ThinkTankEntry) => {
    setEditingEntry(entry);
    setFormData({
      title: entry.title,
      category: entry.category,
      tags: entry.tags.join(', '),
      content: entry.content,
      excerpt: entry.excerpt || '',
      is_featured: entry.is_featured,
      is_published: entry.is_published,
      author_name: entry.author_name || '',
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.content) {
      toast.error('Title and content are required');
      return;
    }

    if (editingEntry) {
      updateMutation.mutate({ id: editingEntry.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Brain className="h-6 w-6 text-cyan-400" />
            Think Tank Manager
          </h2>
          <p className="text-slate-400 text-sm">Manage SYNTH™ standards, playbooks, and documentation</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="bg-cyan-600 hover:bg-cyan-700">
              <Plus className="h-4 w-4 mr-2" />
              New Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingEntry ? 'Edit Entry' : 'Create New Entry'}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div>
                <Label>Title *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Entry title"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value: ThinkTankCategory) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(categoryConfig) as ThinkTankCategory[]).map(cat => (
                        <SelectItem key={cat} value={cat}>
                          <div className="flex items-center gap-2">
                            {categoryConfig[cat].icon}
                            {categoryConfig[cat].label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Author Name</Label>
                  <Input
                    value={formData.author_name}
                    onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                    placeholder="Author name"
                  />
                </div>
              </div>

              <div>
                <Label>Tags (comma-separated)</Label>
                <Input
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="SYNTH, agentic-ai, quality"
                />
              </div>

              <div>
                <Label>Excerpt (optional)</Label>
                <Textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Brief summary for preview cards"
                  rows={2}
                />
              </div>

              <div>
                <Label>Content *</Label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Full content (supports line breaks)"
                  rows={12}
                />
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                  />
                  <Label>Featured</Label>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.is_published}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                  />
                  <Label>Published</Label>
                </div>
              </div>

              <Button 
                onClick={handleSubmit} 
                className="w-full"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {editingEntry ? 'Update Entry' : 'Create Entry'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Entries List */}
      {isLoading ? (
        <div className="text-center py-8 text-slate-400">Loading...</div>
      ) : (
        <div className="space-y-3">
          {entries?.map(entry => (
            <Card key={entry.id} className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        {categoryConfig[entry.category].icon}
                        <span className="ml-1">{categoryConfig[entry.category].label}</span>
                      </Badge>
                      {entry.is_featured && (
                        <Badge className="bg-amber-500/20 text-amber-400 text-xs">
                          <Pin className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                      {!entry.is_published && (
                        <Badge variant="outline" className="text-slate-500 text-xs">
                          <EyeOff className="h-3 w-3 mr-1" />
                          Draft
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-semibold text-white truncate">{entry.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      v{entry.version} • Updated {new Date(entry.updated_at).toLocaleDateString()}
                      {entry.author_name && ` • By ${entry.author_name}`}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleFeatureMutation.mutate({ id: entry.id, is_featured: !entry.is_featured })}
                      className={entry.is_featured ? 'text-amber-400' : 'text-slate-500'}
                    >
                      <Pin className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => togglePublishMutation.mutate({ id: entry.id, is_published: !entry.is_published })}
                      className={entry.is_published ? 'text-emerald-400' : 'text-slate-500'}
                    >
                      {entry.is_published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(entry)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteConfirmId(entry.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {entries?.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              No entries yet. Create your first Think Tank entry.
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Entry?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the entry.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirmId && deleteMutation.mutate(deleteConfirmId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ThinkTankManager;

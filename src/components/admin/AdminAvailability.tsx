import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Clock, Calendar } from "lucide-react";
import { format } from "date-fns";
import { cs } from "date-fns/locale";

const DAYS_OF_WEEK = [
  { value: 1, label: "Pondělí" },
  { value: 2, label: "Úterý" },
  { value: 3, label: "Středa" },
  { value: 4, label: "Čtvrtek" },
  { value: 5, label: "Pátek" },
  { value: 6, label: "Sobota" },
  { value: 0, label: "Neděle" },
];

const AdminAvailability = () => {
  const [loading, setLoading] = useState(false);
  const [availabilityList, setAvailabilityList] = useState<any[]>([]);
  const [blockedDatesList, setBlockedDatesList] = useState<any[]>([]);

  // Availability dialog state
  const [availDialogOpen, setAvailDialogOpen] = useState(false);
  const [editingAvail, setEditingAvail] = useState<any>(null);
  const [availForm, setAvailForm] = useState({
    day_of_week: 1,
    start_time: "09:00",
    end_time: "17:00",
    is_active: true,
  });

  // Blocked dates dialog state
  const [blockedDialogOpen, setBlockedDialogOpen] = useState(false);
  const [blockedForm, setBlockedForm] = useState({
    date: "",
    reason: "",
  });

  useEffect(() => {
    fetchAvailability();
    fetchBlockedDates();
  }, []);

  const fetchAvailability = async () => {
    const { data, error } = await supabase
      .from("availability")
      .select("*")
      .order("day_of_week", { ascending: true })
      .order("start_time", { ascending: true });

    if (error) {
      toast.error("Chyba při načítání dostupnosti: " + error.message);
      return;
    }

    setAvailabilityList(data || []);
  };

  const fetchBlockedDates = async () => {
    const { data, error } = await supabase
      .from("blocked_dates")
      .select("*")
      .order("date", { ascending: true });

    if (error) {
      toast.error("Chyba při načítání blokovaných dnů: " + error.message);
      return;
    }

    setBlockedDatesList(data || []);
  };

  const resetAvailForm = () => {
    setAvailForm({
      day_of_week: 1,
      start_time: "09:00",
      end_time: "17:00",
      is_active: true,
    });
    setEditingAvail(null);
  };

  const handleAvailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validation
      if (availForm.end_time <= availForm.start_time) {
        toast.error("Konec času musí být po začátku");
        return;
      }

      if (editingAvail) {
        // Update existing
        const { error } = await supabase
          .from("availability")
          .update(availForm)
          .eq("id", editingAvail.id);

        if (error) throw error;
        toast.success("Dostupnost aktualizována");
      } else {
        // Create new
        const { error } = await supabase.from("availability").insert(availForm);

        if (error) throw error;
        toast.success("Dostupnost přidána");
      }

      setAvailDialogOpen(false);
      resetAvailForm();
      fetchAvailability();
    } catch (error: any) {
      toast.error("Chyba: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditAvail = (avail: any) => {
    setEditingAvail(avail);
    setAvailForm({
      day_of_week: avail.day_of_week,
      start_time: avail.start_time,
      end_time: avail.end_time,
      is_active: avail.is_active,
    });
    setAvailDialogOpen(true);
  };

  const handleDeleteAvail = async (id: string) => {
    if (!confirm("Opravdu chcete smazat tuto dostupnost?")) return;

    const { error } = await supabase.from("availability").delete().eq("id", id);

    if (error) {
      toast.error("Chyba při mazání: " + error.message);
      return;
    }

    toast.success("Dostupnost smazána");
    fetchAvailability();
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    const { error } = await supabase
      .from("availability")
      .update({ is_active: !currentActive })
      .eq("id", id);

    if (error) {
      toast.error("Chyba při změně stavu: " + error.message);
      return;
    }

    toast.success(currentActive ? "Dostupnost deaktivována" : "Dostupnost aktivována");
    fetchAvailability();
  };

  const handleBlockedSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validation
      if (!blockedForm.date) {
        toast.error("Datum je povinné");
        return;
      }

      const selectedDate = new Date(blockedForm.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        toast.error("Nelze blokovat dny v minulosti");
        return;
      }

      const { error } = await supabase.from("blocked_dates").insert({
        date: blockedForm.date,
        reason: blockedForm.reason || null,
      });

      if (error) throw error;

      toast.success("Den zablokován");
      setBlockedDialogOpen(false);
      setBlockedForm({ date: "", reason: "" });
      fetchBlockedDates();
    } catch (error: any) {
      toast.error("Chyba: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBlocked = async (id: string) => {
    if (!confirm("Opravdu chcete odblokovat tento den?")) return;

    const { error } = await supabase.from("blocked_dates").delete().eq("id", id);

    if (error) {
      toast.error("Chyba při mazání: " + error.message);
      return;
    }

    toast.success("Den odblokován");
    fetchBlockedDates();
  };

  // Group availability by day
  const availabilityByDay = DAYS_OF_WEEK.reduce((acc, day) => {
    acc[day.value] = availabilityList.filter((a) => a.day_of_week === day.value);
    return acc;
  }, {} as Record<number, any[]>);

  return (
    <div className="space-y-8">
      {/* Weekly Schedule Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-serif font-semibold">Týdenní Rozvrh</h3>
            <p className="text-muted-foreground">Nastavte dostupnost pro jednotlivé dny v týdnu</p>
          </div>
          <Dialog open={availDialogOpen} onOpenChange={setAvailDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetAvailForm} className="bg-gradient-gold">
                <Plus className="mr-2" size={16} />
                Přidat Dostupnost
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingAvail ? "Upravit Dostupnost" : "Přidat Dostupnost"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAvailSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="day_of_week">Den v Týdnu</Label>
                  <Select
                    value={String(availForm.day_of_week)}
                    onValueChange={(value) =>
                      setAvailForm({ ...availForm, day_of_week: parseInt(value) })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DAYS_OF_WEEK.map((day) => (
                        <SelectItem key={day.value} value={String(day.value)}>
                          {day.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="start_time">Začátek</Label>
                  <Input
                    id="start_time"
                    type="time"
                    value={availForm.start_time}
                    onChange={(e) => setAvailForm({ ...availForm, start_time: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="end_time">Konec</Label>
                  <Input
                    id="end_time"
                    type="time"
                    value={availForm.end_time}
                    onChange={(e) => setAvailForm({ ...availForm, end_time: e.target.value })}
                    required
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={availForm.is_active}
                    onCheckedChange={(checked) =>
                      setAvailForm({ ...availForm, is_active: checked })
                    }
                  />
                  <Label>Aktivní</Label>
                </div>

                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setAvailDialogOpen(false);
                      resetAvailForm();
                    }}
                  >
                    Zrušit
                  </Button>
                  <Button type="submit" disabled={loading} className="bg-gradient-gold">
                    {loading ? "Ukládám..." : editingAvail ? "Uložit" : "Přidat"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {DAYS_OF_WEEK.map((day) => {
            const dayAvailability = availabilityByDay[day.value] || [];
            return (
              <Card key={day.value}>
                <CardHeader>
                  <CardTitle className="text-lg">{day.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  {dayAvailability.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Žádná dostupnost</p>
                  ) : (
                    <div className="space-y-2">
                      {dayAvailability.map((avail) => (
                        <div
                          key={avail.id}
                          className="flex items-center justify-between p-2 bg-muted rounded-lg"
                        >
                          <div className="flex items-center gap-2">
                            <Clock size={14} className="text-muted-foreground" />
                            <span className="text-sm font-medium">
                              {avail.start_time} - {avail.end_time}
                            </span>
                            {!avail.is_active && (
                              <Badge variant="secondary" className="text-xs">
                                Neaktivní
                              </Badge>
                            )}
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleActive(avail.id, avail.is_active)}
                            >
                              <Switch checked={avail.is_active} />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleEditAvail(avail)}>
                              <Pencil size={14} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteAvail(avail.id)}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Blocked Dates Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-serif font-semibold">Blokované Dny</h3>
            <p className="text-muted-foreground">Zablokujte konkrétní dny, kdy nejste dostupní</p>
          </div>
          <Dialog open={blockedDialogOpen} onOpenChange={setBlockedDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => setBlockedForm({ date: "", reason: "" })}
                className="bg-gradient-gold"
              >
                <Plus className="mr-2" size={16} />
                Blokovat Den
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Blokovat Den</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleBlockedSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="blocked_date">Datum</Label>
                  <Input
                    id="blocked_date"
                    type="date"
                    value={blockedForm.date}
                    onChange={(e) => setBlockedForm({ ...blockedForm, date: e.target.value })}
                    required
                    min={format(new Date(), "yyyy-MM-dd")}
                  />
                </div>

                <div>
                  <Label htmlFor="blocked_reason">Důvod (volitelné)</Label>
                  <Textarea
                    id="blocked_reason"
                    value={blockedForm.reason}
                    onChange={(e) => setBlockedForm({ ...blockedForm, reason: e.target.value })}
                    placeholder="např. Dovolená, Nemoc, Konference..."
                    rows={3}
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setBlockedDialogOpen(false)}
                  >
                    Zrušit
                  </Button>
                  <Button type="submit" disabled={loading} className="bg-gradient-gold">
                    {loading ? "Ukládám..." : "Blokovat"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardContent className="p-0">
            {blockedDatesList.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Žádné blokované dny</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Datum</TableHead>
                    <TableHead>Důvod</TableHead>
                    <TableHead className="text-right">Akce</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {blockedDatesList.map((blocked) => (
                    <TableRow key={blocked.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-muted-foreground" />
                          {format(new Date(blocked.date), "d. MMMM yyyy", { locale: cs })}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {blocked.reason || "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteBlocked(blocked.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAvailability;

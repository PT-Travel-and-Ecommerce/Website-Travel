"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type BankAccount = {
  id: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  order?: number;
};

export default function PaymentSettingsPage() {
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);

  const [newAccount, setNewAccount] = useState<Omit<BankAccount, "id">>({
    bankName: "",
    accountNumber: "",
    accountName: "",
    order: 0,
  });

  const [editing, setEditing] = useState<Record<string, Partial<BankAccount>>>({});

  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [savingWhatsApp, setSavingWhatsApp] = useState(false);

  const sortedAccounts = useMemo(
    () => [...bankAccounts].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [bankAccounts]
  );

  useEffect(() => {
    const load = async () => {
      try {
        const [accRes, settingsRes] = await Promise.all([
          fetch("/api/bank-accounts"),
          fetch("/api/settings"),
        ]);
        const accData = await accRes.json();
        const settings = await settingsRes.json();
        if (Array.isArray(accData)) setBankAccounts(accData);
        if (settings && typeof settings.whatsappNumber === "string") {
          setWhatsappNumber(settings.whatsappNumber);
        }
      } catch (e) {
        toast.error("Gagal memuat data");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleCreate = async () => {
    if (!newAccount.bankName || !newAccount.accountNumber || !newAccount.accountName) {
      toast.error("Lengkapi semua field rekening");
      return;
    }
    try {
      const res = await fetch("/api/bank-accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAccount),
      });
      if (!res.ok) throw new Error();
      const created = await res.json();
      setBankAccounts((prev) => [...prev, created]);
      setNewAccount({ bankName: "", accountNumber: "", accountName: "", order: 0 });
      toast.success("Rekening ditambahkan");
    } catch (e) {
      toast.error("Gagal menambah rekening");
    }
  };

  const handleUpdate = async (id: string) => {
    const payload = editing[id];
    if (!payload) return;
    try {
      const res = await fetch(`/api/bank-accounts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setBankAccounts((prev) => prev.map((x) => (x.id === id ? updated : x)));
      setEditing((prev) => {
        const cp = { ...prev };
        delete cp[id];
        return cp;
      });
      toast.success("Rekening diperbarui");
    } catch (e) {
      toast.error("Gagal memperbarui rekening");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus rekening ini?")) return;
    try {
      const res = await fetch(`/api/bank-accounts/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setBankAccounts((prev) => prev.filter((x) => x.id !== id));
      toast.success("Rekening dihapus");
    } catch (e) {
      toast.error("Gagal menghapus rekening");
    }
  };

  const saveWhatsApp = async () => {
    setSavingWhatsApp(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ whatsappNumber }),
      });
      if (!res.ok) throw new Error();
      toast.success("Nomor WhatsApp disimpan");
    } catch (e) {
      toast.error("Gagal menyimpan nomor WhatsApp");
    } finally {
      setSavingWhatsApp(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">Memuat...</div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Pengaturan Pembayaran</h1>
        <p className="text-sm text-muted-foreground">Kelola rekening tujuan dan nomor WhatsApp.</p>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Nomor WhatsApp</Label>
              <Input
                placeholder="contoh: 628123456789"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={saveWhatsApp} disabled={savingWhatsApp}>
              {savingWhatsApp ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Nama Bank</Label>
              <Input
                placeholder="BCA / Mandiri / BNI"
                value={newAccount.bankName}
                onChange={(e) => setNewAccount((s) => ({ ...s, bankName: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Nomor Rekening</Label>
              <Input
                placeholder="1234567890"
                value={newAccount.accountNumber}
                onChange={(e) => setNewAccount((s) => ({ ...s, accountNumber: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Nama Pemilik</Label>
              <Input
                placeholder="Travel Indonesia"
                value={newAccount.accountName}
                onChange={(e) => setNewAccount((s) => ({ ...s, accountName: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Urutan</Label>
              <Input
                type="number"
                value={newAccount.order ?? 0}
                onChange={(e) => setNewAccount((s) => ({ ...s, order: Number(e.target.value) }))}
              />
            </div>
          </div>
          <div>
            <Button onClick={handleCreate}>Tambah Rekening</Button>
          </div>

          <div className="border-t pt-4 space-y-3">
            {sortedAccounts.length === 0 && (
              <div className="text-sm text-muted-foreground">Belum ada rekening.</div>
            )}
            {sortedAccounts.map((acc) => {
              const edit = editing[acc.id] ?? {};
              return (
                <div key={acc.id} className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
                  <div className="space-y-1">
                    <Label>Bank</Label>
                    <Input
                      defaultValue={acc.bankName}
                      onChange={(e) =>
                        setEditing((s) => ({ ...s, [acc.id]: { ...s[acc.id], bankName: e.target.value } }))
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>No. Rekening</Label>
                    <Input
                      defaultValue={acc.accountNumber}
                      onChange={(e) =>
                        setEditing((s) => ({ ...s, [acc.id]: { ...s[acc.id], accountNumber: e.target.value } }))
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Atas Nama</Label>
                    <Input
                      defaultValue={acc.accountName}
                      onChange={(e) =>
                        setEditing((s) => ({ ...s, [acc.id]: { ...s[acc.id], accountName: e.target.value } }))
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Urutan</Label>
                    <Input
                      type="number"
                      defaultValue={acc.order ?? 0}
                      onChange={(e) =>
                        setEditing((s) => ({ ...s, [acc.id]: { ...s[acc.id], order: Number(e.target.value) } }))
                      }
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => handleUpdate(acc.id)}>
                      Simpan
                    </Button>
                    <Button variant="destructive" onClick={() => handleDelete(acc.id)}>
                      Hapus
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

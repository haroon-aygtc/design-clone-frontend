
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AIModel } from "@/types/aiModels";

interface ModelDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  model?: AIModel;
  onConfirmDelete: () => void;
}

const ModelDeleteDialog = ({ open, onOpenChange, model, onConfirmDelete }: ModelDeleteDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Disconnect Model</DialogTitle>
          <DialogDescription>
            Are you sure you want to disconnect {model?.name}? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button variant="destructive" onClick={onConfirmDelete}>Disconnect</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModelDeleteDialog;

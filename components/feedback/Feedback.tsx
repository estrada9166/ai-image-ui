import { useState } from "react";
import { graphql } from "@/gql/gql";
import { useMutation } from "urql";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HelpCircle, MessageSquare, Send } from "lucide-react";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { Textarea } from "@/components/ui/textarea";

const addFeedbackDocument = graphql(/* GraphQL */ `
  mutation AddFeedback($input: AddFeedbackInput!) {
    addFeedback(input: $input)
  }
`);

export default function Feedback() {
  const { t } = useTranslation();
  const [feedback, setFeedback] = useState<string>("");
  const [isFeedbackSubmitted, setIsFeedbackSubmitted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [, addFeedback] = useMutation(addFeedbackDocument);

  const handleSubmit = () => {
    if (!feedback.trim()) return;

    addFeedback({
      input: {
        feedback,
      },
    }).then((res) => {
      if (res.data?.addFeedback) {
        setIsFeedbackSubmitted(true);
      }
    });
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Reset state when dialog closes
      setTimeout(() => {
        setIsFeedbackSubmitted(false);
        setFeedback("");
      }, 300);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <SidebarMenuButton>
          <HelpCircle className="size-4" />
          <span>{t("feedback.title")}</span>
        </SidebarMenuButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="size-5" />
            {t("feedback.title")}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {isFeedbackSubmitted ? (
            <div className="flex flex-col items-center justify-center gap-4 py-6">
              <div className="rounded-full bg-green-100 p-3">
                <Send className="size-6 text-green-600" />
              </div>
              <p className="text-center text-lg font-medium">
                {t("feedback.thanksMessage")}
              </p>
              <p className="text-center text-sm text-muted-foreground">
                {t("feedback.thanksDescription") || "We appreciate your input"}
              </p>
            </div>
          ) : (
            <div>
              <Textarea
                id="feedback"
                placeholder={t("feedback.inputPlaceholder")}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="min-h-[120px] resize-none"
              />
            </div>
          )}
        </div>
        <DialogFooter>
          {!isFeedbackSubmitted ? (
            <Button
              type="submit"
              disabled={!feedback.trim()}
              onClick={handleSubmit}
              className="gap-2"
            >
              <Send className="size-4" />
              {t("feedback.sendFeedback")}
            </Button>
          ) : (
            <Button onClick={() => handleOpenChange(false)}>
              {t("common.close") || "Close"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

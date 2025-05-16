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
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { Textarea } from "@/components/ui/textarea";

const addFeedbackDocument = graphql(/* GraphQL */ `
  mutation AddFeedback($input: AddFeedbackInput!) {
    addFeedback(input: $input)
  }
`);

type FeedbackProps = React.PropsWithChildren & {
  userIsLoggedIn: boolean;
  hasActiveSubscription: boolean;
};

export default function Feedback(props: FeedbackProps) {
  const { t } = useTranslation();

  const [feedback, setFeedback] = useState<string | null>(null);
  const [email, setUserEmail] = useState<string | null>(null);
  const [isFeedbackSubmitted, setIsFeedbackSubmitted] = useState(false);

  const [, addFeedback] = useMutation(addFeedbackDocument);

  const handleSubmit = () => {
    if (!feedback) {
      return;
    }

    addFeedback({
      input: {
        feedback,
        email,
      },
    }).then((res) => {
      if (res.data?.addFeedback) {
        setIsFeedbackSubmitted(true);
      }
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <SidebarMenuButton
          size="sm"
          className="hover:bg-indigo-100 cursor-pointer"
        >
          <Send />
          <span>{t("feedback.title")}</span>
        </SidebarMenuButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("feedback.title")}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {isFeedbackSubmitted ? (
            <div className="text-center sm:text-xl sm:leading-6 py-1.5 text-gray-700">
              <span>{t("feedback.thanksMessage")}</span>
            </div>
          ) : (
            <>
              {!props.userIsLoggedIn && (
                <div>
                  <Input
                    id="email"
                    defaultValue=""
                    placeholder="you@example.com"
                    onChange={(e) => setUserEmail(e.target.value)}
                  />
                </div>
              )}
              <div>
                <Textarea
                  id="feedback"
                  placeholder={t("feedback.inputPlaceholder")}
                  defaultValue=""
                  onChange={(e) => setFeedback(e.target.value)}
                />
              </div>
            </>
          )}
        </div>
        <DialogFooter>
          {!isFeedbackSubmitted && (
            <Button type="submit" disabled={!feedback} onClick={handleSubmit}>
              {t("common.sendFeedback")}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

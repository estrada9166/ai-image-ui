"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { KeyRound, Loader2, ShieldCheck, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { graphql } from "@/gql";
import { useMutation } from "urql";
import { useTranslation } from "react-i18next";

const UpdateUserPasswordMutation = graphql(/* GraphQL */ `
  mutation UpdateUserPassword($input: UpdateUserPasswordInput!) {
    updateUserPassword(input: $input) {
      id
      email
    }
  }
`);

export default function Settings() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const [, updateUserPassword] = useMutation(UpdateUserPasswordMutation);

  const passwordSchema = z
    .object({
      currentPassword: z.string().min(1, t("settings.currentPasswordRequired")),
      newPassword: z
        .string()
        .min(8, t("settings.passwordMustBeAtLeast8Characters"))
        .regex(
          /[A-Z]/,
          t("settings.passwordMustContainAtLeastOneUppercaseLetter")
        )
        .regex(
          /[a-z]/,
          t("settings.passwordMustContainAtLeastOneLowercaseLetter")
        )
        .regex(/[0-9]/, t("settings.passwordMustContainAtLeastOneNumber")),
      confirmPassword: z
        .string()
        .min(1, t("settings.pleaseConfirmYourPassword")),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    });

  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof passwordSchema>) {
    setIsLoading(true);

    try {
      // This would be replaced with your actual API call
      await updateUserPassword({
        input: {
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        },
      });

      toast({
        title: t("settings.passwordUpdated"),
        description: t("settings.passwordUpdatedDescription"),
      });

      form.reset();
    } catch {
      toast({
        title: t("settings.error"),
        description: t("settings.passwordUpdateError"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container max-w-4xl py-10">
      <Card className="shadow-md border-opacity-50 overflow-hidden rounded-xl">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 pb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 rounded-full">
              <ShieldCheck className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <Badge
                variant="outline"
                className="mb-1 bg-white/50 dark:bg-black/20 text-indigo-600 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800"
              >
                {t("settings.security")}
              </Badge>
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-indigo-700 to-purple-700 dark:from-indigo-400 dark:to-purple-400 text-transparent bg-clip-text">
                {t("settings.accountSettings")}
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 px-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem className="transition-all duration-200 hover:shadow-sm rounded-lg p-2 -mx-2">
                      <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t("settings.currentPassword")}
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="password"
                            placeholder="••••••••"
                            className="pl-10 h-10 border-gray-200 dark:border-gray-700 focus:border-indigo-400 focus:ring-indigo-300 dark:focus:border-indigo-600 dark:focus:ring-indigo-800"
                            {...field}
                          />
                          <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <Separator className="my-3 opacity-50" />

                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem className="transition-all duration-200 hover:shadow-sm rounded-lg p-2 -mx-2">
                      <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t("settings.newPassword")}
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="password"
                            placeholder="••••••••"
                            className="pl-10 h-10 border-gray-200 dark:border-gray-700 focus:border-indigo-400 focus:ring-indigo-300 dark:focus:border-indigo-600 dark:focus:ring-indigo-800"
                            {...field}
                          />
                          <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        </div>
                      </FormControl>
                      <FormDescription className="text-xs mt-2 text-gray-500 dark:text-gray-400">
                        {t("settings.passwordRequirementsDescription")}
                      </FormDescription>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="transition-all duration-200 hover:shadow-sm rounded-lg p-2 -mx-2">
                      <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t("settings.confirmPassword")}
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="password"
                            placeholder="••••••••"
                            className="pl-10 h-10 border-gray-200 dark:border-gray-700 focus:border-indigo-400 focus:ring-indigo-300 dark:focus:border-indigo-600 dark:focus:ring-indigo-800"
                            {...field}
                          />
                          <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                className="w-full h-10 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-md rounded-lg font-medium text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("settings.updatingPassword")}
                  </>
                ) : (
                  <>
                    <KeyRound className="mr-2 h-4 w-4" />
                    {t("settings.updatePassword")}
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

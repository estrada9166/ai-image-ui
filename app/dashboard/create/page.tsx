"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ImageIcon, VideoIcon } from "lucide-react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";

export default function CreateImagePage() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-6xl">
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Create Content
        </h1>
        <p className="text-sm text-muted-foreground">
          Choose what type of AI-generated content you want to create
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/dashboard/create/image" className="block">
            <Card className="hover:shadow-lg transition-all cursor-pointer border-muted/30 hover:border-primary/40 hover:scale-102 duration-300 overflow-hidden group h-full">
              <CardContent className="p-6 flex flex-col items-center justify-center space-y-4">
                <div className="bg-primary/10 p-4 rounded-full group-hover:bg-primary/20 transition-colors">
                  <ImageIcon className="h-10 w-10 text-primary" />
                </div>
                <div className="text-center">
                  <CardTitle className="text-xl mb-2">Create Image</CardTitle>
                  <CardDescription>
                    Generate stunning AI images from text descriptions
                  </CardDescription>
                </div>
                <Button className="mt-4 w-full">Get Started</Button>
              </CardContent>
            </Card>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Link href="/dashboard/create/video" className="block">
            <Card className="hover:shadow-lg transition-all cursor-pointer border-muted/30 hover:border-primary/40 hover:scale-102 duration-300 overflow-hidden group h-full">
              <CardContent className="p-6 flex flex-col items-center justify-center space-y-4">
                <div className="bg-primary/10 p-4 rounded-full group-hover:bg-primary/20 transition-colors">
                  <VideoIcon className="h-10 w-10 text-primary" />
                </div>
                <div className="text-center">
                  <CardTitle className="text-xl mb-2">Create Video</CardTitle>
                  <CardDescription>
                    Transform your ideas into captivating AI-generated videos
                  </CardDescription>
                </div>
                <Button className="mt-4 w-full">Get Started</Button>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

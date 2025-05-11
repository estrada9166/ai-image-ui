"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

import { ModelSelector } from "@/components/playground/components/model-selector";
import { PresetSelector } from "@/components/playground/components/preset-selector";
import { TemperatureSelector } from "@/components/playground/components/temperature-selector";
import { models, types } from "@/components/playground/data/models";
import {
  presets,
  types as presetTypes,
} from "@/components/playground/data/presets";
import { ImageStack } from "@/components/imageGallery/ImageStack";
import { graphql } from "@/gql";
import { useMutation } from "urql";

export const EditImageMutation = graphql(/* GraphQL */ `
  mutation EditImage($input: ImageEditInput!) {
    imageEdit(input: $input) {
      id
      imageUrl
      prompt
      status
    }
  }
`);

export default function PlaygroundPage() {
  const [, editImage] = useMutation(EditImageMutation);

  const [imageUrls, setImageUrls] = useState<string[]>([
    // "https://dluchi.vtexassets.com/arquivos/ids/158182-1200-auto?v=638427429628600000&width=1200&height=auto&aspect=true",
    // "https://dluchi.vtexassets.com/arquivos/ids/158372-1200-auto?v=638755882557400000&width=1200&height=auto&aspect=true",
    // "https://dluchi.vtexassets.com/arquivos/ids/158373-1200-auto?v=638755882557400000&width=1200&height=auto&aspect=true",
    // "https://anikmakeup.com/cdn/shop/files/BRILLO_TONO_1_1000X1000_0d6acff2-93ed-4df0-ab24-da0b355fa841.jpg?v=1739370590",
    // "https://local-ship-fast.s3.amazonaws.com/basket-1746708084321.png?AWSAccessKeyId=AKIA5FCD6CLBJZMC6ZZZ&Expires=1746726088&Signature=GjVpD5jw%2BvPeyBu0v9D28q0LTG0%3D",
    // "https://local-ship-fast.s3.amazonaws.com/basket-1746708548977.png?AWSAccessKeyId=AKIA5FCD6CLBJZMC6ZZZ&Expires=1746726552&Signature=5EG%2F8H287WHn20rcubSf7Gi8Qcg%3D",
    // "https://kanu.pet/cdn/shop/files/ProductoenAccion_bba52322-b9de-4103-9cd5-4b434037fca3.jpg?v=1736975367&width=1206",
    // "https://local-ship-fast.s3.amazonaws.com/basket-1746757509104.png?AWSAccessKeyId=AKIA5FCD6CLBJZMC6ZZZ&Expires=1746775510&Signature=rsn8bv1Fpy1J77cHH4zBddxLgPM%3D",
    "https://cdn.shopify.com/s/files/1/0828/2655/9799/files/LOMAVERDE_MOCKUP_2_cea2ca2a-f6ba-4f55-9102-23a7d06dd831.png?v=1719959821",
    // "https://local-ship-fast.s3.amazonaws.com/basket-1746758260810.png?AWSAccessKeyId=AKIA5FCD6CLBJZMC6ZZZ&Expires=1746776266&Signature=lxVfYula6G7MIF6GUEKIgTRTwqc%3D",
  ]);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [createdImageUrl, setCreatedImageUrl] = useState<string | null>(null);

  const handleSubmit = () => {
    setIsLoading(true);
    editImage({
      input: {
        imageUrls,
        prompt,
      },
    }).then((result) => {
      setIsLoading(false);
      setCreatedImageUrl(result.data?.imageEdit || null);
    });
  };

  return (
    <div className="h-full flex-col md:flex mx-4">
      <div className="container flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
        <h2 className="text-lg font-semibold">Playground</h2>
      </div>
      <Separator />
      <Tabs defaultValue="edit" className="flex-1">
        <div className="container h-full py-6">
          <div className="grid h-full items-stretch gap-6 md:grid-cols-[1fr_200px]">
            <div className="hidden flex-col space-y-4 sm:flex md:order-2">
              <PresetSelector presets={presets} types={presetTypes} />
              <ModelSelector types={types} models={models} />
              <TemperatureSelector defaultValue={[0.56]} />
            </div>
            <div className="md:order-1">
              <TabsContent value="edit" className="mt-0 border-0 p-0">
                <div className="flex flex-col space-y-4">
                  <div className="grid h-full gap-6 lg:grid-cols-2">
                    <div className="flex flex-col space-y-4">
                      <div className="flex flex-col space-y-2">
                        <ImageStack
                          images={imageUrls}
                          setImageUrls={setImageUrls}
                        />
                      </div>
                      <div className="flex  flex-1 flex-col space-y-2">
                        <Textarea
                          id="instructions"
                          placeholder="Fix the grammar."
                          className="h-[200px]"
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="min-h-[400px] rounded-md border bg-muted lg:min-h-[700px] relative">
                      {isLoading ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4"></div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Creating your image...
                          </p>
                        </div>
                      ) : createdImageUrl ? (
                        <img
                          src={createdImageUrl}
                          alt="Generated image"
                          className="w-full h-full object-contain p-2"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                          <p>Your generated image will appear here</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button onClick={handleSubmit}>Submit</Button>
                    <Button variant="secondary">
                      <span className="sr-only">Show history</span>
                      <RotateCcw />
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </div>
          </div>
        </div>
      </Tabs>
    </div>
  );
}

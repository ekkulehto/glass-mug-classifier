import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Text } from '@/components/ui/text';
import { View } from 'react-native';

export default function AboutScreen() {
  return (
    <View className="px-4">
      <Accordion
        type="single"
        collapsible
        className="-mx-4 w-[calc(100%+32px)] max-w-lg"
        defaultValue="item-1"
      >
        <AccordionItem value="item-1" className="px-4">
          <AccordionTrigger>
            <Text>📊 Dataset & AI Model</Text>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance pb-4">
            <Text>
              The dataset was compiled by the developer, consisting of{' '}
              <Text className="font-semibold">1104 glass images</Text> and{' '}
              <Text className="font-semibold">1097 mug images</Text>.
            </Text>

            <Text>
              A total of{' '}
              <Text className="font-semibold">9 different types of glasses</Text>{' '}
              and{' '}
              <Text className="font-semibold">6 different types of mugs</Text>{' '}
              were used. While this quantity is limited, using a bit of
              creativity resulted in a fairly good dataset. The dataset was
              trained using{' '}
              <Text className="font-semibold">Azure Custom Vision</Text> service.
            </Text>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2" className="px-4">
          <AccordionTrigger>
            <Text>📱 App, API, & Azure Infrastructure</Text>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance pb-4">
            <Text>
              The application itself was programmed by the developer. The
              backend infrastructure, including the{' '}
              <Text className="font-semibold">Azure Function App</Text> and{' '}
              <Text className="font-semibold">
                Entra ID
              </Text>
              , is hosted within the developer's own Azure subscription.
            </Text>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3" className="px-4">
          <AccordionTrigger>
            <Text>🖼️ Placeholder Image</Text>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance pb-4">
            <Text>
              The placeholder image used in the application was acquired with
              permission.
            </Text>

            <Text>
              Taken by <Text className="font-semibold">{'{name}'}</Text> and can
              be found at:{' '}
              <Text className="font-semibold">{'{address}'}</Text>.
            </Text>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4" className="px-4">
          <AccordionTrigger>
            <Text>✨ Splash & App Icons</Text>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance pb-4">
            <Text>
              Both the splash screen icons and the main application icon were
              generated using an <Text className="font-semibold">AI image generator</Text>, specifically based on the{' '}
              <Text className="font-semibold">ChatGPT Sora</Text> model.
            </Text>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-5" className="px-4">
          <AccordionTrigger>
            <Text>💡 AI Assistance in Development</Text>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance pb-4">
            <Text>
              AI tools{' '}(
              <Text className="font-semibold">ChatGPT 5</Text> and{' '}
              <Text className="font-semibold">Gemini 2.5 Pro</Text>){' '}
              were utilized extensively to support the entire project. As this
              is the developer's first time building a native Android
              application, traditional Googling often didn't provide
              complete solutions, but adapting AI-generated guidance proved
              effective.
            </Text>

            <Text>
              The biggest hurdles were related to{' '}
              <Text className="font-semibold">Microsoft Entra authentication</Text>{' '}
              setup on both the Azure and the application sides. AI tools were also
              invaluable for <Text className="font-semibold">debugging</Text> and{' '}
              <Text className="font-semibold">troubleshooting</Text>.
            </Text>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </View>
  );
}

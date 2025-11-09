import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Text } from '@/components/ui/text';
import { View } from 'react-native';
import { Icon } from '@/components/ui/icon';
import { Database, Code2, Image, Wallpaper, BrainCircuit } from 'lucide-react-native';
import * as WebBrowser from 'expo-web-browser';

const TITLE_SIZE = 'text-lg';
const TITLE_WEIGHT = 'font-normal';
const BODY_CLASS = 'text-base';
const ICON_SIZE = 24;
const ICON_STROKE = 1.5;
const TRIGGER_CLASS = 'py-3 min-h-12';

export default function AboutScreen() {
  return (
    <View className="px-4">
      <Accordion
        type="single"
        collapsible
        className="-mx-4 w-[calc(100%+32px)] max-w-lg"
      >
        <AccordionItem value="item-1" className="px-4">
          <AccordionTrigger className={TRIGGER_CLASS}>
            <View className="flex-row items-center gap-5">
              <Icon as={Database} size={ICON_SIZE} strokeWidth={ICON_STROKE} />
              <Text className={`${TITLE_SIZE} ${TITLE_WEIGHT}`}>Dataset & AI Model</Text>
            </View>
          </AccordionTrigger>
          <AccordionContent className={`flex flex-col gap-4 text-balance pb-4`}>
            <Text className={BODY_CLASS}>
              The dataset was compiled by the developer, consisting of{' '}
              <Text className="font-semibold">1104 glass images</Text> and{' '}
              <Text className="font-semibold">1097 mug images</Text>.
            </Text>

            <Text className={BODY_CLASS}>
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
          <AccordionTrigger className={TRIGGER_CLASS}>
            <View className="flex-row items-center gap-5">
              <Icon as={Code2} size={ICON_SIZE} strokeWidth={ICON_STROKE} />
              <Text className={`${TITLE_SIZE} ${TITLE_WEIGHT}`}>App, API, & Azure Infrastructure</Text>
            </View>
          </AccordionTrigger>
          <AccordionContent className={`flex flex-col gap-4 text-balance pb-4`}>
            <Text className={BODY_CLASS}>
              The application itself was programmed by the developer. The
              backend infrastructure, including the{' '}
              <Text className="font-semibold">Azure Function App</Text> and{' '}
              <Text className="font-semibold">Entra ID</Text>, is hosted within
              the developer&apos;s own Azure subscription.
            </Text>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3" className="px-4">
          <AccordionTrigger className={TRIGGER_CLASS}>
            <View className="flex-row items-center gap-5">
              <Icon as={Image} size={ICON_SIZE} strokeWidth={ICON_STROKE} />
              <Text className={`${TITLE_SIZE} ${TITLE_WEIGHT}`}>Placeholder Image</Text>
            </View>
          </AccordionTrigger>
          <AccordionContent className={`flex flex-col gap-4 text-balance pb-4`}>
            <Text className={BODY_CLASS}>
              The placeholder image used in the application was acquired with
              permission.
            </Text>

            <Text className={BODY_CLASS}>
              Taken by <Text className="font-semibold">Katja Heigl</Text> and can be found at{' '}
              <Text
                className="font-semibold text-blue-500 underline"
                accessibilityRole="link"
                onPress={() => WebBrowser.openBrowserAsync(
                  'https://pixabay.com/photos/mulled-wine-christmas-drink-6704928/'
                )}
              >
                Pixabay
              </Text>
              .
            </Text>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4" className="px-4">
          <AccordionTrigger className={TRIGGER_CLASS}>
            <View className="flex-row items-center gap-5">
              <Icon as={Wallpaper} size={ICON_SIZE} strokeWidth={ICON_STROKE} />
              <Text className={`${TITLE_SIZE} ${TITLE_WEIGHT}`}>Splash & App Icons</Text>
            </View>
          </AccordionTrigger>
          <AccordionContent className={`flex flex-col gap-4 text-balance pb-4`}>
            <Text className={BODY_CLASS}>
              Both the main application icon and the splash screen assets were created with{" "}
              <Text className="font-semibold">Android Studio’s Image Asset Studio</Text>.
            </Text>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-5" className="px-4">
          <AccordionTrigger className={TRIGGER_CLASS}>
            <View className="flex-row items-center gap-5">
              <Icon as={BrainCircuit} size={ICON_SIZE} strokeWidth={ICON_STROKE} />
              <Text className={`${TITLE_SIZE} ${TITLE_WEIGHT}`}>AI Assistance in Development</Text>
            </View>
          </AccordionTrigger>
          <AccordionContent className={`flex flex-col gap-4 text-balance pb-4`}>
            <Text className={BODY_CLASS}>
              AI tools (<Text className="font-semibold">ChatGPT 5</Text> and{" "}
              <Text className="font-semibold">Gemini 2.5 Pro</Text>) supported the project
              throughout. As this was my first native Android app, traditional web searches
              rarely produced end-to-end solutions, so adapting AI-generated guidance proved
              especially effective.
            </Text>

            <Text className={BODY_CLASS}>
              The most challenging tasks were configuring{" "}
              <Text className="font-semibold">Microsoft Entra ID</Text> in Azure and in the
              client, and integrating <Text className="font-semibold">Microsoft Graph</Text>{" "}
              for user data. As deadlines approached, I relied on AI more than intended; I’m{" "}
              <Text className="font-semibold">not satisfied</Text> with that. Next time, I’ll
              reduce this dependency by reserving more time for manual verification and
              documentation.
            </Text>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </View>
  );
}

import { MinimalTiptapEditor } from './components/minimal-tiptap'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { cn } from './lib/utils'
import { Hero } from './components/custom/hero'
import { BentoMinimalTiptap } from './components/custom/types'
import { Editor, EditorContent, useEditor } from '@tiptap/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { StarterKit } from '@tiptap/starter-kit'
import { createExtensions } from '@/components/minimal-tiptap/hooks/use-minimal-tiptap.ts'

export default function App() {
  return (
    <div className="px-4 py-12 sm:py-24">
      <main className="mx-auto w-full max-w-4xl">
        <Hero />
        <div className="mt-12 flex flex-col gap-12 sm:mt-20">
          {/*<BentoMinimalTiptap />*/}
           <ExampleForm />
           <ExampleForm2 />
        </div>
      </main>
    </div>
  )
}

const formSchema = z.object({
  description: z
    .string({
      required_error: 'Description is required'
    })
    .min(1, 'Description is required')
})

type FormValues = z.infer<typeof formSchema>

export const ExampleForm2: React.FC = () => {
  const [editable, setEditable] = useState(false)
  const editor = useEditor({
    shouldRerenderOnTransaction: false,
    editable,
    content: `
        <h1 class="heading-node">Hellloooo</h1><h3 class="heading-node">heading 3</h3><p class="text-node"></p><p class="text-node"></p><p class="text-node"><span>aaaaa</span><br><br><span><strong><em><s><u>aa</u></s></em></strong></span><br><br><span style="color: var(--mt-accent-red)"><strong><em><s><u>aaaaa</u></s></em></strong></span><br><br><br><code class="inline" spellcheck="false">aaaaaaaaa</code></p>
      `,
    extensions: createExtensions(''),
  })

  useEffect(() => {
    if (!editor) {
      return undefined
    }

    editor.setEditable(editable)
  }, [editor, editable])

  if (!editor) {
    return null
  }

  return (
    <>
      <div className="control-group">
        <div className="button-group">
          <input
            type="checkbox"
            id="editable"
            value={editable}
            onChange={event => setEditable(event.target.checked)}
          />
          <label htmlFor="editable">Editable</label>
        </div>
      </div>
      <EditorContent editor={editor} />
    </>
  )
}

export const ExampleForm: React.FC = () => {
  const editorRef = useRef<Editor | null>(null)
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: ''
    }
  })

  const handleCreate = useCallback(
    ({ editor }: { editor: Editor }) => {
      if (form.getValues('description') && editor.isEmpty) {
        editor.commands.setContent(form.getValues('description'))
      }
      editorRef.current = editor
    },
    [form]
  )

  const onSubmit = (values: FormValues) => {
    console.log('==Getting values from form==')
    console.log(editorRef.current?.getHTML())
    console.log("Posting Message")
    window.parent.postMessage(editorRef.current?.getHTML(), "https://wordweft.wixstudio.com/");
    console.log('Success: Values retrieved from form')

    setTimeout(() => {
      console.log('==Clearing form==')
      form.reset()
      console.log('Success: Form cleared')
    }, 1000)

    setTimeout(() => {
      console.log('==Clearing editor==')
      editorRef.current?.commands.clearContent()
      console.log('Success: Editor cleared')
    }, 2000)

    setTimeout(() => {
      console.log('==Resetting editor==')
      editorRef.current?.commands.setContent('')
      console.log('Success: Editor reset')
    }, 3000)

    setTimeout(() => {
      console.log('==Setting editor content==')
      editorRef.current?.commands.setContent(values.description)
      console.log('Success: Editor content set')
    }, 4000)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">Description</FormLabel>
              <FormControl>
                <MinimalTiptapEditor
                  {...field}
                  throttleDelay={0}
                  className={cn('w-full', {
                    'border-destructive focus-within:border-destructive': form.formState.errors.description
                  })}
                  editorContentClassName="some-class"
                  output="html"
                  placeholder="Type your description here..."
                  onCreate={handleCreate}
                  autofocus={true}
                  immediatelyRender={true}
                  editable={true}
                  injectCSS={false}
                  editorClassName="focus:outline-none p-5"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" size="lg" className="w-full">
          Submit
        </Button>
      </form>
    </Form>
  )
}

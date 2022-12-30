import * as React from 'react';
import { Box, Button, Flex, Heading, Text } from '@ttoss/ui';
import { Form, FormFieldInput, useForm, yup, yupResolver } from '@ttoss/forms';
import { NextSeo } from 'next-seo';
import Link from 'next/link';

const API_KEY_LOCAL_STORAGE_KEY = 'API_KEY';

const schema = yup.object({
  apiKey: yup.string().required(),
  message: yup.string().required(),
});

type FormValues = yup.InferType<typeof schema>;

const postArt = async ({ message, apiKey }: FormValues) => {
  const response = await fetch('/api/art', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    },
    body: JSON.stringify({ message }),
  });

  return response.json();
};

const Publish = () => {
  const formMethods = useForm<FormValues>({
    mode: 'onBlur',
    resolver: yupResolver(schema),
  });

  const { register, watch, reset, setValue } = formMethods;

  React.useEffect(() => {
    const apiKey = localStorage.getItem(API_KEY_LOCAL_STORAGE_KEY);
    if (apiKey) {
      setValue('apiKey', apiKey);
    }
  }, [setValue]);

  const apiKey = watch('apiKey');

  React.useEffect(() => {
    if (apiKey) {
      localStorage.setItem(API_KEY_LOCAL_STORAGE_KEY, apiKey);
    }
  }, [apiKey]);

  const [apiResponse, setApiResponse] = React.useState<any>();

  const [loading, setLoading] = React.useState(false);

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    const res = await postArt(values);
    setApiResponse(res);
    reset({ apiKey: values.apiKey, message: '' });
    setLoading(false);
  };

  return (
    <>
      <NextSeo title="Publish Art" nofollow noindex />
      <Form {...formMethods} onSubmit={onSubmit}>
        <Flex
          sx={{
            width: '100%',
            justifyContent: 'center',
          }}
        >
          <Flex
            sx={{
              flexDirection: 'column',
              width: '100%',
              maxWidth: 800,
              gap: 3,
            }}
          >
            <Heading
              sx={{
                fontSize: '5xl',
                alignSelf: 'center',
                marginY: 4,
              }}
            >
              Publish Art
            </Heading>
            <FormFieldInput name="apiKey" label="API Key" disabled={!!apiKey} />
            {/* <FormFieldInput name="message" label="Message" /> */}
            <Text sx={{ padding: 0, margin: 0 }}>Message</Text>
            <textarea
              {...register('message')}
              rows={8}
              style={{
                resize: 'vertical',
              }}
            />
            {apiResponse && (
              <>
                <Box
                  as="pre"
                  sx={{
                    fontSize: 'base',
                  }}
                >
                  {JSON.stringify(apiResponse, null, 2)}
                </Box>
                <Link href={apiResponse?.permalink}>
                  <Text>{apiResponse?.permalink}</Text>
                </Link>
              </>
            )}
            <Button
              disabled={loading}
              sx={{
                marginY: 4,
                width: 150,
                fontSize: 'xl',
                alignSelf: 'center',
              }}
            >
              Publish
            </Button>
            <Link href="/">
              <Text>Home</Text>
            </Link>
          </Flex>
        </Flex>
      </Form>
    </>
  );
};

export default Publish;

/*
Copyright 2020 Adobe
All Rights Reserved.
NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe.
*/

import React, { useEffect } from 'react';
import ViewSDKClient from './ViewSDKClient';

export default function FullWindow({
  url,
  title,
  id,
  slides
}: {
  url: string;
  title: string;
  id: string;
  slides?: boolean;
}) {
  useEffect(() => {
    const viewSDKClient = new ViewSDKClient();
    viewSDKClient.ready().then(() => {
      /* Invoke file preview */
      /* By default the embed mode will be Full Window */
      viewSDKClient.previewFile(
        'pdf-div',
        slides
          ? { embedMode: 'SIZED_CONTAINER' }
          : { defaultViewMode: 'FIT_WIDTH' },
        url,
        title,
        id
      );
    });
  }, []);

  return <div id="pdf-div" className="absolute t-0 l-0 w-full h-full" />;
}

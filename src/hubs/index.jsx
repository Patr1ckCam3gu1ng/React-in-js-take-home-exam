import * as signalR from "@aspnet/signalr";

import common from "common/index";

const url = common.apiUrl();

export default {
  connect: hubName => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${url}/${hubName}`)
      .build();

    return {
      start: () => connection.start(),
      connection: connection
    };
  }
};
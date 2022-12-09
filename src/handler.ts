import { Context, APIGatewayProxyCallback, APIGatewayEvent } from "aws-lambda";

export const groups = (
  event: APIGatewayEvent,
  context: Context,
  callback: APIGatewayProxyCallback
): void => {
  console.log(`Event: ${JSON.stringify(event, null, 2)}`);

  const groupArray = getGroupArray(JSON.parse(event.body,null));
  const allowedGroupSizes = getGroupSizes(groupArray);

  callback(null, {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({
      sizes: allowedGroupSizes.toString(),
    }),
  });
};

function getGroupArray(input: any): number[] {
  let groupsArray: number[] = [];
  input.groups
    .split(",")
    .forEach((element: string) => groupsArray.push(parseInt(element)));

  return groupsArray;
}

function getGroupSizes(groupsArray: number[]): number[] {
  let validGroups = [];

  let copyArray = [...groupsArray];
  const minGroupSize = copyArray[copyArray.sort().length - 1]; // sort modifica el array original!!

  let maxSize = 0;
  groupsArray.forEach((group) => (maxSize = maxSize + group));
  const maxGroupSize = maxSize;

  for (let i = minGroupSize; i <= maxGroupSize; i++) {
    let acum = 0;
    let validGroup = false;
    for (let j = 0; j < groupsArray.length; j++) {
      acum = acum + groupsArray[j];
      if (acum == i) {
        validGroup = true;
        acum = 0;
      } else {
        validGroup = false;
      }
    }
    if (validGroup == true) {
      validGroups.push(i);
    }
  }
  return validGroups;
}

declare namespace kintone {
  namespace events {
    function on(
      event: string,
      handler: (event: any) => any
    ): void;
  }

  namespace app {
    function getId(): number;
    function getQueryCondition(): string;
    function getQuery(): string;
    
    namespace record {
      interface RecordData {
        [fieldCode: string]: {
          type: string;
          value: any;
        };
      }
      
      interface Record {
        record: RecordData;
      }
    }
  }
}
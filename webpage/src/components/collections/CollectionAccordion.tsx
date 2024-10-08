import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Stack from "@mui/material/Stack";
import { Collection } from "@state/inventory";
import { Droppable } from "@hello-pangea/dnd";
import { GroupList } from "@components/collections/GroupList.tsx";
import { CollectionActions } from "@components/collections/CollectionActions.tsx";
import { useState } from "react";
import { CollectionInfo } from "@components/collections/CollectionInfo.tsx";

export const CollectionAccordion = ({
  collection,
}: {
  collection: Collection;
}) => {
  const [open, setOpen] = useState(true);
  return (
    <Accordion
      expanded={open}
      onChange={() => setOpen(!open)}
      key={collection.id}
      elevation={3}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1-content"
        id="panel1-header"
      >
        <CollectionInfo collection={collection} />
      </AccordionSummary>
      <AccordionDetails>
        <Droppable droppableId={collection.id} isDropDisabled={!open}>
          {(provided) => (
            <Stack
              spacing={2}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              <GroupList groupIds={collection.groups} />

              {provided.placeholder}

              <CollectionActions collection={collection} />
            </Stack>
          )}
        </Droppable>
      </AccordionDetails>
    </Accordion>
  );
};
